import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categoryData = [
  { name: 'Electronics', count: 10, percent: '41.7%', color: '#3b82f6' },
  { name: 'Accessories', count: 6, percent: '25.0%', color: '#10b981' },
  { name: 'Documents', count: 3, percent: '12.5%', color: '#f59e0b' },
  { name: 'Clothing', count: 3, percent: '12.5%', color: '#ec4899' },
  { name: 'Others', count: 2, percent: '8.3%', color: '#94a3b8' },
];

export default function CategoryBreakdown({ data = categoryData, total = 24 }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header */}
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Category Breakdown
      </h3>

      {/* Chart & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut with Total in Center */}
        <div className="relative w-[130px] h-[130px] shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val, name) => [`${val} items`, name]}
                contentStyle={{
                  fontSize: '11px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {total}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* Legend on Right */}
        <div className="space-y-1.5 flex-1 min-w-0 w-full sm:w-auto">
          {data.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-xs py-0.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate text-[11px]">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] shrink-0 ml-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cat.count}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  ({cat.percent})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
