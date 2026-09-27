import React, { useState } from "react";
import { ShieldCheck, MapPin, Calendar, FileText, User, Check, X, Loader2 } from "lucide-react";
import Card from "../../Components/Admin/common/Card";
import StatusBadge from "../../Components/ui/StatusBadge";
import Avatar from "../../Components/ui/Avatar";
import { lostFoundApi } from "../lostFound/lostFoundApi";
import { toast } from "react-toastify";

export default function ClaimCard({ claim, canReview = true, onActionComplete }) {
  const [approveClaim, { isLoading: isApproving }] = lostFoundApi.useApproveClaimMutation();
  const [rejectClaim, { isLoading: isRejecting }] = lostFoundApi.useRejectClaimMutation();
  const [confirmReject, setConfirmReject] = useState(false);

  const statusStr = String(claim.status || "").toUpperCase();
  const isPending = !["APPROVED", "REJECTED", "COMPLETED"].includes(statusStr);
  const isLoading = isApproving || isRejecting;

  const handleApprove = async () => {
    try {
      await approveClaim(claim.id).unwrap();
      toast.success(`Claim #${claim.id} approved successfully!`);
      if (onActionComplete) onActionComplete("approve", claim);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to approve claim.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectClaim(claim.id).unwrap();
      toast.info(`Claim #${claim.id} has been rejected.`);
      setConfirmReject(false);
      if (onActionComplete) onActionComplete("reject", claim);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to reject claim.");
    }
  };

  return (
    <Card className="p-6 transition-all" hover>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-base font-extrabold uppercase tracking-wider text-slate-400">
            Claim ID: #{claim.id}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {claim.item?.name || claim.report?.title || "Claimed Belonging"}
          </h4>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {(claim.item?.images?.[0] || claim.report?.images?.[0]) && (
          <img
            src={claim.item?.images?.[0] || claim.report?.images?.[0]}
            alt={claim.item?.name || claim.report?.title || "Claimed item"}
            className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
          />
        )}
        <div className="md:col-span-2 space-y-2">
          <div className="text-base font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Ownership Verification Details:</span>
          </div>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {claim.proofDescription || claim.describedHiddenDetail || "No additional proof description provided."}
          </p>

          {claim.adminNotes && (
            <div className="text-base text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
              <strong>Admin Note:</strong> {claim.adminNotes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-base text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Avatar
            src={claim.claimant?.avatar || claim.claimantAvatar}
            name={claim.claimant?.name || claim.claimantName || "Claimant"}
            size="xs"
          />
          <span>
            Claimant:{" "}
            <strong className="text-slate-700 dark:text-slate-300">
              {claim.claimant?.name || claim.claimantName || "User"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "Recently"}
            </span>
          </div>

          {canReview && isPending && (
            <div className="flex items-center gap-2">
              {!confirmReject ? (
                <>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleApprove}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isApproving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setConfirmReject(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 transition-colors disabled:opacity-50 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5 p-1 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/50">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium px-1">
                    Confirm reject?
                  </span>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleReject}
                    className="px-2 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                  >
                    {isRejecting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setConfirmReject(false)}
                    className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

