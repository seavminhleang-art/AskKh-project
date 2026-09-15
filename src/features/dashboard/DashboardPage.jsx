import { HelpCircle, Tags } from "lucide-react";
import { useAppSelector } from "../../hooks/useAppStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import Button from "../../Components/ui/button";
import StatCard from "./components/StatCard";
import RecentActivityCard from "./components/RecentActivityCard";
import MyItemsCard from "./components/MyItemsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import MatchSummaryCard from "./components/MatchSummaryCard";
import NotificationsPreviewCard from "./components/NotificationsPreviewCard";
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetMyLostFoundItemsQuery,
  useGetMatchSummaryQuery,
  useGetRecentNotificationsQuery,
} from "./dashboardApi";

function PopularCategoriesCard() {
  const categories = [
    "Bags & Backpacks",
    "Electronics",
    "ID & Documents",
    "Water Bottles",
  ];
  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-4 w-4 text-brand-primary" />
          Popular Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-brand-primary-light px-3 py-1.5 text-lg font-medium text-brand-primary"
          >
            {category}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
function SupportCard() {
  return (
    <Card className="border-brand-primary/20 bg-brand-primary-light dark:bg-gray-800">
      <CardContent className="p-5">
        <HelpCircle className="h-6 w-6 text-brand-primary" />
        <h2 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
          Need Help?
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Find answers or contact the AskKH support team.
        </p>
        <Button
          size="sm"
          className="mt-4 bg-brand-primary hover:bg-brand-primary/90"
        >
          Visit Help Center
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name || user?.displayName || "Sovannrith";
  const stats = useGetDashboardStatsQuery();
  const activity = useGetRecentActivityQuery();
  const items = useGetMyLostFoundItemsQuery();
  const match = useGetMatchSummaryQuery();
  const notifications = useGetRecentNotificationsQuery();
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-title font-semibold leading-snug text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-1 text-body leading-relaxed text-gray-500 dark:text-gray-400">
          Welcome back, {name}. Here&apos;s what&apos;s happening with your
          account.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.isLoading
          ? [1, 2, 3, 4].map((key) => <StatCard key={key} isLoading />)
          : stats.data?.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
      </section>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <RecentActivityCard
            activity={activity.data || []}
            isLoading={activity.isLoading}
            isError={activity.isError}
          />
          <MyItemsCard
            items={items.data || []}
            isLoading={items.isLoading}
            isError={items.isError}
          />
          <QuickActionsCard />
        </div>
        <aside className="space-y-5">
          <MatchSummaryCard
            match={match.data}
            isLoading={match.isLoading}
            isError={match.isError}
          />
          <NotificationsPreviewCard
            notifications={notifications.data || []}
            isLoading={notifications.isLoading}
            isError={notifications.isError}
          />
          <PopularCategoriesCard />
          <SupportCard />
        </aside>
      </div>
    </div>
  );
}
