import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../../hooks/useLanguage";

const activityData = [
  { month: "Jan", question: 6, answer: 8, voted: 5 },
  { month: "Feb", question: 4, answer: 10, voted: 6 },
  { month: "Mar", question: 7, answer: 6, voted: 4 },
  { month: "Apr", question: 5, answer: 9, voted: 7 },
  { month: "May", question: 8, answer: 7, voted: 5 },
  { month: "Jun", question: 6, answer: 11, voted: 6 },
  { month: "Jul", question: 5, answer: 8, voted: 4 },
  { month: "Aug", question: 7, answer: 9, voted: 5 },
  { month: "Sep", question: 6, answer: 10, voted: 6 },
  { month: "Oct", question: 8, answer: 8, voted: 5 },
  { month: "Nov", question: 5, answer: 7, voted: 6 },
  { month: "Dec", question: 7, answer: 9, voted: 7 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md p-2 text-xs space-y-1 z-50">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </p>
        <div className="space-y-0.5 text-xs">
          {payload.map((entry) => (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between gap-3"
            >
              <span className="capitalize text-slate-500 dark:text-slate-400">
                {entry.dataKey}:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function ActivityOverview({ data = activityData }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t("dashboard.activityOverview")}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {t("activity.subtitle")}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{t("qa.askQuestion")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t("qa.answers")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{t("qa.votes")}</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="w-full h-[175px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -22, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
              className="dark:stroke-slate-800/80"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              dy={4}
            />
            <YAxis
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="question"
              stackId="activity"
              fill="#f43f5e"
              barSize={14}
            />
            <Bar
              dataKey="answer"
              stackId="activity"
              fill="#10b981"
              barSize={14}
            />
            <Bar
              dataKey="voted"
              stackId="activity"
              fill="#3b82f6"
              barSize={14}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
