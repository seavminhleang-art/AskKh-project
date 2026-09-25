import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
  KeyRound,
} from "lucide-react";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../../features/auth/authApi";
import { authError } from "../../features/auth/authError";
import { useLanguage } from "../Language/LanguageContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import BrandLogo from "../common/BrandLogo.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import { usePageSEO } from "../common/SEO.jsx";

const copy = {
  en: {
    backHome: "Back to home",
    verifyingTitle: "Verifying your email…",
    verifyingDesc:
      "Please wait while we validate your verification token with the server.",
    successTitle: "Email Verified!",
    successDesc:
      "Your email address has been successfully verified. You can now sign in to access all community features.",
    signInBtn: "Continue to Sign In",
    errorTitle: "Verification Failed",
    errorDesc:
      "The verification link is invalid, expired, or has already been used.",
    resendPrompt: "Need a new verification link?",
    resendPlaceholder: "Enter your registered email",
    resendBtn: "Resend Verification Email",
    resending: "Sending…",
    invalidEmailError: "Please enter a valid email address.",
    resendError: "Could not resend verification email. Please try again.",
    noTokenTitle: "Email Verification",
    noTokenDesc:
      "Enter the verification token from your email or request a new verification link.",
    manualTokenLabel: "Paste verification token:",
    manualTokenPlaceholder: "e.g. MXVNNmOShDq6k1kdGGjor8Qf...",
    verifyBtn: "Verify Account",
  },
  km: {
    backHome: "ត្រឡប់ទៅទំព័រដើម",
    verifyingTitle: "កំពុងផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នក…",
    verifyingDesc:
      "សូមរង់ចាំ ខណៈពេលដែលយើងផ្ទៀងផ្ទាត់លេខកូដសម្ងាត់របស់អ្នកជាមួយប្រព័ន្ធ។",
    successTitle: "អ៊ីមែលត្រូវបានផ្ទៀងផ្ទាត់ជោគជ័យ!",
    successDesc:
      "អាសយដ្ឋានអ៊ីមែលរបស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់រួចរាល់ហើយ។ អ្នកអាចចូលប្រើប្រាស់ឥឡូវនេះបាន។",
    signInBtn: "បន្តទៅកាន់ការចូលគណនី",
    errorTitle: "ការផ្ទៀងផ្ទាត់មិនបានជោគជ័យ",
    errorDesc:
      "តំណភ្ជាប់ផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ ផុតកំណត់ ឬត្រូវបានប្រើប្រាស់រួចហើយ។",
    resendPrompt: "ត្រូវការតំណភ្ជាប់ផ្ទៀងផ្ទាត់ថ្មី?",
    resendPlaceholder: "បញ្ចូលអ៊ីមែលដែលបានចុះឈ្មោះ",
    resendBtn: "ផ្ញើអ៊ីមែលផ្ទៀងផ្ទាត់ឡើងវិញ",
    resending: "កំពុងផ្ញើ…",
    resendSuccess:
      "តំណភ្ជាប់ផ្ទៀងផ្ទាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នកហើយ!",
    invalidEmailError: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលត្រឹមត្រូវ។",
    resendError: "មិនអាចផ្ញើអ៊ីមែលផ្ទៀងផ្ទាត់បានទេ។ សូមព្យាយាមម្តងទៀត។",
    noTokenTitle: "ការផ្ទៀងផ្ទាត់អ៊ីមែល",
    noTokenDesc:
      "សូមបញ្ចូលលេខកូដសម្ងាត់ផ្ទៀងផ្ទាត់ពីអ៊ីមែលរបស់អ្នក ឬស្នើសុំតំណភ្ជាប់ថ្មីខាងក្រោម។",
    manualTokenLabel: "បិទភ្ជាប់លេខកូដសម្ងាត់ (Token):",
    manualTokenPlaceholder: "ឧ. MXVNNmOShDq6k1kdGGjor8Qf...",
    verifyBtn: "ផ្ទៀងផ្ទាត់គណនី",
  },
};

export default function VerifyEmailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { isKhmer } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const t = isKhmer ? copy.km : copy.en;

  usePageSEO({
    title: "Verify Email | NEXA",
    description:
      "Verify your email address to activate your NEXA developer account.",
    noIndex: true,
  });

  const [verifyEmail, { isLoading, isSuccess, isError, data, error }] =
    useVerifyEmailMutation();
  const [resendVerification, resendState] = useResendVerificationMutation();

  const [manualToken, setManualToken] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendFeedback, setResendFeedback] = useState(null);
  const attemptedToken = useRef(null);

  useEffect(() => {
    if (token && attemptedToken.current !== token) {
      attemptedToken.current = token;
      verifyEmail({ token }).catch(() => {
        // Handled via RTK Query state
      });
    }
  }, [token, verifyEmail]);

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setSearchParams({ token: manualToken.trim() });
    attemptedToken.current = manualToken.trim();
    verifyEmail({ token: manualToken.trim() }).catch(() => {});
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail || !resendEmail.includes("@")) {
      setResendFeedback({ ok: false, message: t.invalidEmailError });
      return;
    }
    setResendFeedback(null);
    try {
      await resendVerification({ email: resendEmail.trim() }).unwrap();
      setResendFeedback({ ok: true, message: t.resendSuccess });
      setResendEmail("");
    } catch (err) {
      setResendFeedback({ ok: false, message: authError(err, t.resendError) });
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-gray-100" : "bg-[#f8fafc] text-gray-800"
      }`}
    >
      {/* Top Bar with Logo & Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group no-underline">
          <BrandLogo
            alt="NEXA"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-base font-medium px-4 py-2 rounded-full border transition-all duration-200 no-underline ${
            darkMode
              ? "border-zinc-700 bg-zinc-900/80 text-gray-300 hover:bg-zinc-800 hover:text-white"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <ArrowLeft size={16} />
          <span>{t.backHome}</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-lg rounded-3xl p-8 sm:p-10 shadow-2xl border text-center transition-all duration-300 ${
            darkMode
              ? "bg-zinc-900/90 border-zinc-800 shadow-black/40"
              : "bg-white border-gray-100 shadow-slate-200/60"
          }`}
        >
          {/* STATE 1: In Flight / Loading */}
          {token && isLoading && (
            <div className="py-8 space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-brand-primary flex items-center justify-center">
                  <LoadingSpinner className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">
                {t.verifyingTitle}
              </h1>
              <p
                className={`text-base leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}
              >
                {t.verifyingDesc}
              </p>
            </div>
          )}

          {/* STATE 2: Verified Successfully */}
          {token && isSuccess && (
            <div className="py-6 space-y-6">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/20"
                >
                  <CheckCircle2 size={44} />
                </motion.div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 text-base font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 mb-3 border border-emerald-500/20">
                  <Sparkles size={13} /> {data?.email || "Account Verified"}
                </span>
                <h1 className="text-5xl sm:text-5xl font-bold tracking-tight text-emerald-500">
                  {t.successTitle}
                </h1>
                <p
                  className={`mt-2 text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}
                >
                  {data?.message || t.successDesc}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-200 no-underline active:scale-[0.98]"
                >
                  <span>{t.signInBtn}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: Verification Error */}
          {token && isError && (
            <div className="py-6 space-y-6">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border-2 border-red-500/20"
                >
                  <XCircle size={44} />
                </motion.div>
              </div>

              <div>
                <h1 className="text-5xl font-bold tracking-tight text-red-500">
                  {t.errorTitle}
                </h1>
                <p
                  className={`mt-2 text-base leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  {authError(error, t.errorDesc)}
                </p>
              </div>

              {/* Resend Verification Form */}
              <div
                className={`p-5 rounded-2xl border text-left space-y-3 ${
                  darkMode
                    ? "bg-zinc-800/60 border-zinc-700/60"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Mail size={16} className="text-brand-primary" />
                  <span>{t.resendPrompt}</span>
                </h3>

                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder={t.resendPlaceholder}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl text-base border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                      darkMode
                        ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={resendState.isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white text-base font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw
                      size={15}
                      className={resendState.isLoading ? "animate-spin" : ""}
                    />
                    <span>
                      {resendState.isLoading ? t.resending : t.resendBtn}
                    </span>
                  </button>
                </form>

                {resendFeedback && (
                  <p
                    className={`text-base font-medium ${
                      resendFeedback.ok ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {resendFeedback.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 text-base font-medium hover:underline ${
                    darkMode ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  <ArrowLeft size={16} />
                  <span>{t.signInBtn}</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 4: Missing Token */}
          {!token && (
            <div className="py-6 space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-brand-primary flex items-center justify-center">
                  <Mail size={32} />
                </div>
              </div>

              <div>
                <h1 className="text-5xl font-bold tracking-tight">
                  {t.noTokenTitle}
                </h1>
                <p
                  className={`mt-2 text-base leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  {t.noTokenDesc}
                </p>
              </div>

              {/* Option A: Paste Token Form */}
              <div
                className={`p-5 rounded-2xl border text-left space-y-3 ${
                  darkMode
                    ? "bg-zinc-800/60 border-zinc-700/60"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <KeyRound size={16} className="text-brand-primary" />
                  <span>{t.manualTokenLabel}</span>
                </h3>

                <form onSubmit={handleManualVerify} className="space-y-3">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder={t.manualTokenPlaceholder}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl text-base border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-mono text-base ${
                      darkMode
                        ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white text-base font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer shadow-md"
                  >
                    <span>{t.verifyBtn}</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              </div>

              {/* Option B: Resend Verification Form */}
              <div
                className={`p-5 rounded-2xl border text-left space-y-3 ${
                  darkMode
                    ? "bg-zinc-800/60 border-zinc-700/60"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Mail size={16} className="text-brand-primary" />
                  <span>{t.resendPrompt}</span>
                </h3>

                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder={t.resendPlaceholder}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl text-base border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                      darkMode
                        ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={resendState.isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-base font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw
                      size={15}
                      className={resendState.isLoading ? "animate-spin" : ""}
                    />
                    <span>
                      {resendState.isLoading ? t.resending : t.resendBtn}
                    </span>
                  </button>
                </form>

                {resendFeedback && (
                  <p
                    className={`text-base font-medium ${
                      resendFeedback.ok ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {resendFeedback.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 text-base font-medium hover:underline ${
                    darkMode ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  <ArrowLeft size={16} />
                  <span>{t.signInBtn}</span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-base text-gray-400">
        &copy; {new Date().getFullYear()} NEXA. All rights reserved.
      </footer>
    </div>
  );
}
