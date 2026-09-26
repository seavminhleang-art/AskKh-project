import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCommunityAuth } from "@/features/lostFound/useCommunityAuth";
import { useCommunityReportQuery } from "@/features/lostFound/communityApi";
import { useWorkspaceSaveMutation } from "@/features/workspace/workspaceApi";
import { formatMediaUrl } from "@/features/workspace/profileImage";
import { 
  Package, 
  Search, 
  MapPin, 
  Calendar, 
  X, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Send,
  Sparkles,
  ExternalLink
} from "lucide-react";

const message = (err) => err?.message || "An unexpected error occurred.";

export default function ReportDetails({ report = { id: 1 }, onClose = () => {}, darkMode = false }) {
  const dialog = useRef(null);
  const query = useCommunityReportQuery(report.id);
  const [save, state] = useWorkspaceSaveMutation();
  const authenticated = useCommunityAuth();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { 
    if (dialog.current && !dialog.current.open) {
      dialog.current.showModal(); 
    }
  }, []);

  const item = query.data?.data || query.data || report;

  async function submit(event) {
    event.preventDefault();
    const detail = new FormData(event.currentTarget).get("detail").trim();
    if (!detail || state.isLoading) return;
    setError("");
    try {
      await save({ 
        resource: "claims", 
        action: "create", 
        id: report.id, 
        body: { describedHiddenDetail: detail } 
      }).unwrap();
      setSubmitted(true);
    } catch (error) { 
      setError(message(error)); 
    }
  }

  const isFound = item && String(item.itemType).toLowerCase() === "found";

  return (
    <dialog 
      ref={dialog} 
      onCancel={onClose} 
      onClose={onClose} 
      className={`m-auto w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop:bg-black/70 backdrop:backdrop-blur-md transition-all duration-300 outline-none ${
        darkMode 
          ? "bg-zinc-900/95 border-zinc-800 text-zinc-100 shadow-indigo-950/30" 
          : "bg-white/95 border-gray-100 text-gray-900 shadow-2xl"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {item && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold tracking-wide uppercase ${
              isFound 
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50" 
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50"
            }`}>
              {isFound ? <Search className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
              {item.itemType} Item
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
            Report #{report.id}
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 cursor-pointer"
          aria-label="Close report"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {query.isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p role="status" className="text-sm font-medium text-gray-500 dark:text-zinc-400">Loading report details…</p>
        </div>
      )}

      {/* Error state */}
      {query.isError && (
        <div role="alert" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span className="text-sm">{message(query.error)}</span>
          </div>
          <button 
            onClick={query.refetch}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-md transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Item details view */}
      {item && (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium text-gray-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {item.freeTextLocation || report.location || "Campus location"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {item.itemDate}
              </span>
            </div>
          </div>

          {item.photoUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 shadow-inner group">
              <img 
                src={formatMediaUrl(item.photoUrl)} 
                alt={item.title} 
                className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-105 transition duration-500" 
              />
            </div>
          )}

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-zinc-800/40 border border-gray-200/60 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-1.5">Description</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-zinc-300">{item.description}</p>
          </div>

          {/* Claim Section for Found Items */}
          {isFound && (
            <div className="pt-4 border-t border-gray-200/60 dark:border-zinc-800">
              {submitted ? (
                <div role="status" className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                  <span>Your claim was submitted successfully. The finder will review your details shortly.</span>
                </div>
              ) : !authenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold">Verify Ownership</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">Sign in to submit a secure claim for this item.</p>
                    </div>
                  </div>
                  <Link 
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition whitespace-nowrap"
                  >
                    <span>Sign In</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4 p-5 rounded-2xl bg-gray-50/80 dark:bg-zinc-800/40 border border-gray-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold">Ownership Verification Claim</h3>
                  </div>
                  <label className="block text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                    Describe a private detail that proves this item belongs to you (e.g. unique scratches, serial number, wallpaper, or contents).
                    <textarea 
                      name="detail" 
                      required 
                      rows={3} 
                      placeholder="Type your secret identifying detail here..."
                      className="block w-full rounded-xl border border-gray-300/60 dark:border-zinc-700/80 p-3.5 mt-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition shadow-sm" 
                    />
                  </label>
                  {error && (
                    <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900/50">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button 
                    disabled={state.isLoading} 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition cursor-pointer"
                  >
                    {state.isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting claim…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit claim</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

// Interactive Live Preview Wrapper Component
export function App() {
  const [isDark, setIsDark] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${isDark ? "bg-zinc-950 text-white" : "bg-gradient-to-br from-indigo-50/50 via-gray-50 to-blue-50/50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">ReportDetails Modal Showcase</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Toggle theme or reopen dialog modal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          >
            Open Modal
          </button>
          <div className="flex items-center gap-1 bg-gray-200 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setIsDark(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${!isDark ? "bg-indigo-600 text-white shadow" : "text-gray-700 dark:text-zinc-300"}`}
            >
              Light
            </button>
            <button
              onClick={() => setIsDark(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isDark ? "bg-indigo-600 text-white shadow" : "text-gray-700 dark:text-zinc-300"}`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="text-center py-20 text-gray-400 dark:text-zinc-600">
        <p className="text-sm">Click "Open Modal" above to test the interactive ReportDetails dialog component.</p>
      </div>

      {modalOpen && (
        <ReportDetails 
          report={{ id: 42, location: "Main Library" }} 
          darkMode={isDark} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}
