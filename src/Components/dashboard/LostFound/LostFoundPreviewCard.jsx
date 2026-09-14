import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Package } from 'lucide-react';

export default function LostFoundPreviewCard({ item }) {
  const isLost = (item.type || '').toLowerCase() === 'lost';

  return (
    <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Item Image or Icon */}
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              isLost
                ? 'bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60'
                : 'bg-blue-50 text-blue-600 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60'
            }`}
          >
            <Package className="w-5 h-5" />
          </div>
        )}

        {/* Item Details */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[16px] font-bold border uppercase tracking-wider ${
                isLost
                  ? 'bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
                  : 'bg-blue-50 text-blue-600 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60'
              }`}
            >
              {item.type}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {item.name}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[16px] text-slate-400 dark:text-slate-500 truncate">
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 shrink-0">
              <Clock className="w-2.5 h-2.5" />
              <span>{item.date}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Status & View Details Action */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[16px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
          {item.status}
        </span>
        <Link
          to={`/lost-found`}
          className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
