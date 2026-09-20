import { FileText, ShieldAlert, Users } from "lucide-react";
import PageHeader from "@/Components/Admin/common/PageHeader";
import StatCard from "@/Components/Admin/common/StatCard";
import Card from "@/Components/Admin/common/Card";
import Avatar from "@/Components/Admin/common/Avatar";
import Badge, { statusTone } from "@/Components/Admin/common/Badge";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

const statIcons = {
  totalUsers: Users,
  activeUsers: Users,
  totalPosts: FileText,
  pendingModeration: ShieldAlert,
};
const colors = ["#0050F3", "#4CAF4F", "#ED2B2A", "#F59E0B", "#8B5CF6"];

function GrowthChart({ points }) {
  const width = 700;
  const height = 220;
  const padding = { top: 12, right: 8, bottom: 28, left: 42 };
  const maximum = 12000;
  const minimum = 0;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: padding.left + (index / (points.length - 1)) * chartWidth,
    y:
      padding.top +
      (1 - (point.users - minimum) / (maximum - minimum)) * chartHeight,
  }));
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding.left},${padding.top + chartHeight} ${line} ${padding.left + chartWidth},${padding.top + chartHeight}`;

  return (
    <div
      className="h-[260px]"
      aria-label={`Growth from ${points[0].users} to ${points.at(-1).users} users`}
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
      >
        {[0, 3000, 6000, 9000, 12000].map((value) => {
          const y = padding.top + (1 - value / maximum) * chartHeight;
          return (
            <g key={value}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#E7ECF4"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 7}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-[14px]"
              >
                {value}
              </text>
            </g>
          );
        })}
        <polygon
          points={area}
          fill="#0050F3"
          opacity="0.12"
          className="origin-bottom chart-area-rise"
        />
        <polyline
          points={line}
          fill="none"
          stroke="#0050F3"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength="1"
          className="chart-line-draw"
        />
        {coordinates.map((point, index) => (
          <circle
            key={point.month}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#0050F3"
            className="chart-point-pop"
            style={{ animationDelay: `${650 + index * 85}ms` }}
          >
            <title>{`${point.month}: ${point.users.toLocaleString()} users`}</title>
          </circle>
        ))}
        {coordinates.map((point) => (
          <text
            key={`${point.month}-label`}
            x={point.x}
            y={height - 4}
            textAnchor="middle"
            className="fill-gray-400 text-[14px]"
          >
            {point.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ActivityChart({ rows }) {
  const max = Math.max(...rows.flatMap((row) => [row.posts, row.comments]));
  return (
    <div className="relative h-60 pt-3">
      <div className="absolute inset-x-0 top-3 bottom-7 grid grid-rows-4">
        {[200, 150, 100, 50].map((value) => (
          <div
            key={value}
            className="relative border-t border-dashed border-gray-100"
          >
            <span className="absolute -left-1 -top-2 -translate-x-full text-base text-gray-400">
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 top-3 bottom-7 flex items-end justify-around gap-2 px-2">
        {rows.map((row, index) => (
          <div
            key={row.day}
            className="flex h-full flex-1 items-end justify-center gap-1"
          >
            <span
              className="w-2/5 rounded-t bg-blue-600 chart-bar-rise"
              style={{
                height: `${(row.posts / max) * 100}%`,
                animationDelay: `${index * 65}ms`,
              }}
              title={`${row.posts} posts`}
            />
            <span
              className="w-2/5 rounded-t bg-blue-100 chart-bar-rise"
              style={{
                height: `${(row.comments / max) * 100}%`,
                animationDelay: `${80 + index * 65}ms`,
              }}
              title={`${row.comments} comments`}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-around text-base text-gray-400">
        {rows.map((row) => (
          <span key={row.day}>{row.day}</span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useDashboardData();
  if (isLoading || !data)
    return <div className="h-64 animate-pulse rounded-lg bg-gray-100" />;

  const donut = data.categoryDistribution.reduce(
    (sum, entry) => sum + entry.value,
    0,
  );
  let running = 0;
  const stops = data.categoryDistribution
    .map((entry, index) => {
      const start = (running / donut) * 100;
      running += entry.value;
      return `${colors[index]} ${start}% ${(running / donut) * 100}%`;
    })
    .join(", ");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of platform activity and health."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={statIcons[stat.key]}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            direction={stat.direction}
            supportingText={stat.supportingText}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h3 className="mb-4 font-semibold text-gray-900">
            Campus Portal Growth
          </h3>
          <GrowthChart points={data.userGrowth} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-gray-900">
            Content by Category
          </h3>
          <div className="flex h-[220px] items-center justify-center">
            <div
              className="relative h-40 w-40 rounded-full"
              style={{ background: `conic-gradient(${stops})` }}
            >
              <div className="absolute inset-8 rounded-full bg-white" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {data.categoryDistribution.map((entry, index) => (
              <span
                key={entry.name}
                className="flex items-center gap-1 text-base text-gray-500"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colors[index] }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h3 className="mb-4 font-semibold text-gray-900">
            Weekly Post &amp; Comment Activity
          </h3>
          <ActivityChart rows={data.postActivity} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-gray-900">
            Top All-Round Campus Champions
          </h3>
          <div className="space-y-3">
            {data.champions.map((champion) => (
              <div key={champion.id} className="flex items-center gap-3">
                <Avatar src={champion.avatar} name={champion.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium text-gray-800">
                    {champion.name}
                  </p>
                  <p className="text-base text-gray-400">{champion.title}</p>
                </div>
                <span className="text-lg font-semibold text-brand-primary">
                  {champion.score.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h3 className="mb-4 font-semibold text-gray-900">Recent Posts</h3>
        <div className="divide-y divide-gray-50">
          {data.recentPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-lg text-gray-800">{post.title}</p>
                <p className="text-base text-gray-400">
                  {post.author} · {post.date}
                </p>
              </div>
              <Badge tone={statusTone(post.status)}>{post.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
