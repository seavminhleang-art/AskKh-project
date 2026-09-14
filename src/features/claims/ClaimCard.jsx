import React from 'react';
import { ShieldCheck, MapPin, Calendar, FileText, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';

export default function ClaimCard({ claim }) {
  return (
    <Card className="p-6 transition-all" hover>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Claim ID: #{claim.id}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {claim.item?.name || 'Claimed Belonging'}
          </h4>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {claim.item?.images?.[0] && (
          <img
            src={claim.item.images[0]}
            alt={claim.item.name}
            className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
          />
        )}
        <div className="md:col-span-2 space-y-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Ownership Verification Details:</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {claim.proofDescription}
          </p>

          {claim.adminNotes && (
            <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
              <strong>Admin Note:</strong> {claim.adminNotes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Avatar src={claim.claimant?.avatar} name={claim.claimant?.name} size="xs" />
          <span>Claimant: <strong className="text-slate-700 dark:text-slate-300">{claim.claimant?.name}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}
