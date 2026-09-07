import React from 'react';
import { X, Sparkles, MapPin, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { useUpdateMatchStatusMutation } from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function MatchDetailsModal({ isOpen, onClose, match }) {
  const [updateMatchStatus, { isLoading }] = useUpdateMatchStatusMutation();

  if (!isOpen || !match) return null;

  const handleConfirm = async () => {
    try {
      await updateMatchStatus({ id: match.id, status: 'CONFIRMED' }).unwrap();
      toast.success('Match confirmed! Both parties have been notified.');
      onClose();
    } catch (e) {
      toast.error('Failed to confirm match.');
    }
  };

  const handleReject = async () => {
    try {
      await updateMatchStatus({ id: match.id, status: 'REJECTED' }).unwrap();
      toast.info('Match dismissed.');
      onClose();
    } catch (e) {
      toast.error('Failed to update match status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pr-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Match Engine Analysis</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {match.matchScore}% Match Confidence
            </h2>
          </div>
          <StatusBadge status={match.status} />
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lost Item */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Lost Item Report
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {match.lostItem.date}
              </span>
            </div>
            <img
              src={match.lostItem.images[0]}
              alt={match.lostItem.name}
              className="w-full h-36 object-cover rounded-xl border border-rose-200/60 dark:border-rose-900/60"
            />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {match.lostItem.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {match.lostItem.description}
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{match.lostItem.location}</span>
            </div>
          </div>

          {/* Found Item */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Found Item Turned In
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {match.foundItem.date}
              </span>
            </div>
            <img
              src={match.foundItem.images[0]}
              alt={match.foundItem.name}
              className="w-full h-36 object-cover rounded-xl border border-emerald-200/60 dark:border-emerald-900/60"
            />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {match.foundItem.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {match.foundItem.description}
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{match.foundItem.location}</span>
            </div>
          </div>
        </div>

        {/* Attribute Breakdown */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Matching Factor Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {match.matchingAttributes.map((attr, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {attr.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {attr.detail}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 ml-2">
                  {attr.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading || match.status === 'REJECTED'}
          >
            Reject Match
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={match.status === 'CONFIRMED'}
          >
            Confirm This Match
          </Button>
        </div>
      </div>
    </div>
  );
}
