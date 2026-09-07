import React from 'react';
import {
  Wallet,
  Smartphone,
  CreditCard,
  Headphones,
  MapPin,
  Clock,
} from 'lucide-react';

const matchesData = [
  {
    id: 1,
    name: 'Black Wallet',
    icon: Wallet,
    iconColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    foundDate: 'Found on May 20, 2024',
    location: 'Library - 2nd Floor',
    status: 'Matched',
    time: '2h ago',
  },
  {
    id: 2,
    name: 'iPhone 14',
    icon: Smartphone,
    iconColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    foundDate: 'Found on May 18, 2024',
    location: 'Building A - Room A205',
    status: 'Pending',
    time: '1d ago',
  },
  {
    id: 3,
    name: 'Student ID Card',
    icon: CreditCard,
    iconColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    foundDate: 'Found on May 15, 2024',
    location: 'Cafeteria',
    status: 'Matched',
    time: '2d ago',
  },
  {
    id: 4,
    name: 'AirPods Pro',
    icon: Headphones,
    iconColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    foundDate: 'Found on May 10, 2024',
    location: 'Building B - Room B102',
    status: 'Pending',
    time: '3d ago',
  },
];

export default function RecentMatches({ matches = matchesData }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Recent Matches
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {matches.map((item) => {
          const Icon = item.icon;
          const isMatched = item.status.toLowerCase() === 'matched';
          return (
            <div
              key={item.id}
              className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 ${item.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {item.foundDate}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
                      : 'bg-amber-50 text-amber-600 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{item.time}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
