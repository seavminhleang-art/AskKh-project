import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  MessageSquare,
  MessageCircle,
  Settings,
  LogIn,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function ProfileSummary({
  user,
  isAuthenticated = false,
  isLoading = false,
  isError = false,
  onRetry,
}) {
  // 1. Loading State: Clean skeleton, no fake information displayed
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3.5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  // 2. Error State: Graceful error fallback with retry
  if (isError) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 rounded-xl p-4 shadow-2xs space-y-3 text-center">
        <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Profile Unavailable
          </h4>
          <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            Unable to retrieve current user details.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg text-lg font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Guest State: Prompt guest to sign in without attempting protected requests
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 text-center">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-200/60 dark:border-blue-900/60">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Guest User
          </h4>
          <p className="text-[16px] text-slate-400 dark:text-slate-500 mt-0.5">
            Sign in to track your questions, reports, and campus activity.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  // 4. Authenticated User State: Real user data from GET /users/me
  const displayName = user.displayName || user.name || "Scholar";
  const username = user.username
    ? `@${user.username}`
    : user.email
      ? `@${user.email.split("@")[0]}`
      : "@scholar";
  const role = user.role || "Scholar";
  const bio = user.bio || "ISTAD Community Scholar";
  const questionsCount = Array.isArray(user.questions)
    ? user.questions.length
    : 0;
  const commentsCount = Array.isArray(user.comments) ? user.comments.length : 0;
  const avatarUrl =
    user.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Profile Overview
        </h3>
        <Link
          to="/settings"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Account Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Profile Header Row */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-11 h-11 rounded-full object-cover border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {displayName}
            </h4>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-900/60 shrink-0">
              <ShieldCheck className="w-2.5 h-2.5" />
              {role}
            </span>
          </div>
          <p className="text-[16px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {username}
          </p>
        </div>
      </div>

      {/* Bio (Public information only) */}
      {bio && (
        <p className="text-[16px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50/60 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
          {bio}
        </p>
      )}

      {/* Quick Community Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100/80 dark:border-slate-800/60">
          <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block leading-tight">
              Questions
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {questionsCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100/80 dark:border-slate-800/60">
          <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block leading-tight">
              Comments
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
