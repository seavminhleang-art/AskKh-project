import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TableSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Pagination from "./Pagination";

// Reusable data table shared across Users, Posts, Comments, Tags,
// Lost & Found, and Moderation. Handles sorting, client-side pagination,
// and loading / error / empty states so each page only supplies columns + rows.
export default function AdminTable({
  columns,
  data = [],
  isLoading,
  isError,
  onRetry,
  pageSize = 6,
  emptyTitle = "No records found",
  emptyDescription,
}) {
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort.key) return data;
    const arr = [...data].sort((a, b) => {
      const av = a[sort.key],
        bv = b[sort.key];
      if (typeof av === "number") return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  if (isLoading) return <TableSkeleton cols={columns.length} />;
  if (isError)
    return <ErrorState message="Unable to load data" onRetry={onRetry} />;
  if (!data.length)
    return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium whitespace-nowrap ${col.sortable ? "cursor-pointer select-none" : ""}`}
                onClick={() => col.sortable && toggleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable &&
                    sort.key === col.key &&
                    (sort.dir === "asc" ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 align-middle whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={sorted.length}
        pageSize={pageSize}
      />
    </div>
  );
}
