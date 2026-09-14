import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../Components/ui/card";
import Badge from "../../../Components/ui/badge";
import Button from "../../../Components/ui/button";
import Skeleton from "../../../Components/ui/Skeleton";

const variants = {
  Active: "blue",
  Pending: "warning",
  Approved: "success",
  Rejected: "coral",
};
export default function MyItemsCard({ items, isLoading, isError }) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle>My Lost &amp; Found Items</CardTitle>
        <Button variant="link" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-20 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-gray-500">
            Your reports could not be loaded.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 sm:flex-row sm:items-center dark:border-gray-700"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${item.color}`}
                >
                  {item.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.title}
                    </p>
                    <Badge variant={variants[item.status]}>{item.status}</Badge>
                  </div>
                  <p className="mt-1 text-lg text-gray-500">
                    {item.kind} · {item.date}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-lg text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
