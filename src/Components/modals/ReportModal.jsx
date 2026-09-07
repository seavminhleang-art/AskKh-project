import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { useCreateReportMutation } from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function ReportModal({
  isOpen,
  onClose,
  targetType = 'QUESTION',
  targetId,
  targetTitle,
}) {
  const [reason, setReason] = useState('Spam or Misleading Content');
  const [details, setDetails] = useState('');
  const [createReport, { isLoading }] = useCreateReportMutation();

  if (!isOpen) return null;

  const reasons = [
    'Spam or Misleading Content',
    'Inappropriate Language or Harassment',
    'Duplicate Post / Question',
    'False Recovery or Fake Claim',
    'Violates ISTAD Community Guidelines',
    'Other Safety Concern',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReport({
        targetType,
        targetId,
        targetTitle,
        reason,
        details,
      }).unwrap();

      toast.success('Report submitted to ISTAD Campus Moderation Team.');
      onClose();
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
              {targetTitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Reason for Report *
            </label>
            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Provide context for our moderators..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" isLoading={isLoading}>
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
