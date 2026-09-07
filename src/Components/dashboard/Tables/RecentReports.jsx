import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Laptop,
  CupSoda,
  Umbrella,
  BookOpen,
} from 'lucide-react';

const reportsData = [
  {
    id: 1,
    name: 'Black Backpack',
    icon: Briefcase,
    iconColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    type: 'Lost',
    location: 'Sports Center',
    date: 'May 21, 2024',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Silver Laptop (MacBook Air)',
    icon: Laptop,
    iconColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    type: 'Found',
    location: 'Library - 3rd Floor',
    date: 'May 20, 2024',
    status: 'Matched',
  },
  {
    id: 3,
    name: 'Water Bottle (Blue)',
    icon: CupSoda,
    iconColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    type: 'Lost',
    location: 'Building A - Room A101',
    date: 'May 19, 2024',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Umbrella (Black)',
    icon: Umbrella,
    iconColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    type: 'Found',
    location: 'Parking Area',
    date: 'May 18, 2024',
    status: 'Closed',
  },
  {
    id: 5,
    name: 'Textbook (Calculus)',
    icon: BookOpen,
    iconColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    type: 'Lost',
    location: 'Cafeteria',
    date: 'May 17, 2024',
    status: 'Active',
  },
];

function TypeBadge({ type }) {
  const isLost = type.toLowerCase() === 'lost';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
        isLost
          ? 'bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
          : 'bg-blue-50 text-blue-600 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60'
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const lower = status.toLowerCase();
  let colorStyle =
    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';

  if (lower === 'active' || lower === 'matched') {
    colorStyle =
      'bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorStyle}`}
    >
      {status}
    </span>
  );
}

export default function RecentReports({ reports = reportsData }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Recent Reports
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="pb-2.5 pl-4 sm:pl-0 font-medium">Item</th>
              <th className="pb-2.5 px-3 font-medium">Type</th>
              <th className="pb-2.5 px-3 font-medium">Location</th>
              <th className="pb-2.5 px-3 font-medium">Date</th>
              <th className="pb-2.5 pr-4 sm:pr-0 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {reports.map((row) => {
              const Icon = row.icon;
              return (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 pl-4 sm:pl-0 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 ${row.iconColor}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-none">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <TypeBadge type={row.type} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {row.location}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-2.5 pr-4 sm:pr-0">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="text-[11px]">Showing 1 to 5 of 9 reports</span>

        <div className="flex items-center gap-1 select-none">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center cursor-pointer ${
              currentPage === 1
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center cursor-pointer ${
              currentPage === 2
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            2
          </button>
          <button
            type="button"
            disabled={currentPage === 2}
            onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
            className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
