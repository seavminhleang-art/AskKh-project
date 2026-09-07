import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import { useCreateClaimMutation } from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function ClaimModal({ isOpen, onClose, item }) {
  const [proofDescription, setProofDescription] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');
  const [error, setError] = useState('');

  const [createClaim, { isLoading }] = useCreateClaimMutation();

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim() || proofDescription.trim().length < 15) {
      setError('Please provide specific details proving ownership (min 15 characters).');
      return;
    }

    try {
      await createClaim({
        reportId: item.id,
        itemId: item.id,
        describedHiddenDetail: proofDescription,
        proofDescription,
        proofPhoto: proofPhoto || undefined,
      }).unwrap();

      toast.success('Ownership claim submitted! Campus Administration will review and notify you.');
      onClose();
    } catch {
      toast.error('Failed to submit claim. Please try again.');
    }
  };

  const itemTitle = item.title || item.name || 'Campus Item';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Claim Ownership
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Item: <span className="font-semibold text-slate-800 dark:text-slate-200">{itemTitle}</span>
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            To ensure secure return, describe the hidden detail only the authentic owner knows (e.g. serial numbers, passcode wallpaper, contents inside, purchase receipt).
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Proof of Ownership / Hidden Detail *
            </label>
            <Textarea
              value={proofDescription}
              onChange={(e) => {
                setProofDescription(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              placeholder="Describe unique marks, serial number, screen lock photo, specific contents, or invoice number..."
              error={error}
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Supporting Photo / ID Card URL (Optional)
            </label>
            <Input
              value={proofPhoto}
              onChange={(e) => setProofPhoto(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="default" isLoading={isLoading} className="rounded-xl">
              Submit Claim Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
