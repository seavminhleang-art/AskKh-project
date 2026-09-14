import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "../../../hooks/useLanguage";

export default function QASummary({ total = 44, growth = "↑9%" }) {
  const { t } = useLanguage();

  const qaData = [
    { name: t("qa.answers"), value: 24, color: "#10b981" },
    { name: t("qa.askQuestion"), value: 20, color: "#f43f5e" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t("dashboard.qaSummary")}
        </h3>
        <div className="text-right">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {growth}
          </span>
        </div>
      </div>

      {/* Donut Chart and Legend */}
      <div className="flex items-center justify-between gap-2 my-auto">
        {/* Donut with Center Text */}
        <div className="relative w-[130px] h-[130px] shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val, name) => [`${val}`, name]}
                contentStyle={{
                  fontSize: "11px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Pie
                data={qaData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                strokeWidth={0}
              >
                {qaData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
              {total}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
              {t("common.all")}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 shrink-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              24 {t("qa.answers")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              20 {t("qa.askQuestion")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
