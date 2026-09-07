import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import MatchDetailsModal from '../../components/modals/MatchDetailsModal';
import { useUpdateMatchStatusMutation } from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function MatchCard({ match }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateMatchStatusMutation();

  const handleConfirm = async () => {
    try {
      await updateStatus({ id: match.id, status: 'CONFIRMED' }).unwrap();
      toast.success('Match confirmed! Both parties notified.');
    } catch (e) {
      toast.error('Failed to confirm match.');
    }
  };

  const handleReject = async () => {
    try {
      await updateStatus({ id: match.id, status: 'REJECTED' }).unwrap();
      toast.info('Match dismissed.');
    } catch (e) {
      toast.error('Failed to reject match.');
    }
  };

  return (
    <>
      <Card className="p-6 transition-all border-slate-200 dark:border-slate-800" hover>
        {/* Match Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
              {match.matchScore}%
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Algorithmic Item Pair</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Matched on {new Date(match.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <StatusBadge status={match.status} />
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Lost item preview */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-3">
            <img
              src={match.lostItem?.images?.[0]}
              alt={match.lostItem?.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-rose-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                Reported Lost
              </span>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {match.lostItem?.name}
              </h5>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{match.lostItem?.location}</span>
              </div>
            </div>
          </div>

          {/* Found item preview */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-3">
            <img
              src={match.foundItem?.images?.[0]}
              alt={match.foundItem?.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-emerald-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Turned In / Found
              </span>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {match.foundItem?.name}
              </h5>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{match.foundItem?.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Attributes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {match.matchingAttributes?.map((attr, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
            >
              {attr.label}: <strong className="text-blue-600 dark:text-blue-400">{attr.score}</strong>
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs rounded-xl"
          >
            View Full Analysis
          </Button>

          {match.status !== 'CONFIRMED' && match.status !== 'REJECTED' && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReject}
                disabled={isLoading}
                className="text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Dismiss
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleConfirm}
                disabled={isLoading}
                className="text-xs rounded-xl"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirm Match
              </Button>
            </div>
          )}
        </div>
      </Card>

      <MatchDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={match}
      />
    </>
  );
}
