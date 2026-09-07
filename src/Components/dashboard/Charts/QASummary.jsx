import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const qaData = [
  { name: 'Answer', value: 24, color: '#10b981' },
  { name: 'Question', value: 20, color: '#f43f5e' },
];

export default function QASummary({ data = qaData, total = 44, growth = '↑9%' }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Q & A</h3>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {growth}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            last month
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
                formatter={(val, name) => [`${val} items`, name]}
                contentStyle={{
                  fontSize: '11px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Pie
                data={data}
                dataKey="value"
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
              Totals
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 shrink-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              24 Answer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              20 Question
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
