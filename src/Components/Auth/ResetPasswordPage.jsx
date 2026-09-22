import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
  KeyRound,
  Mail,
} from "lucide-react";
import { useResetPasswordMutation, useForgotPasswordMutation } from "../../features/auth/authApi";
import { useLanguage } from "../Language/LanguageContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import BrandLogo from "../common/BrandLogo.jsx";

const copy = {
  en: {
    backHome: "Back to home",
    title: "Reset Your Password",
    subtitle: "Create a new strong password for your NEXA account.",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter at least 8 characters",
    confirmPasswordLabel: "Confirm New Password",
    confirmPasswordPlaceholder: "Re-enter new password",
    manualTokenLabel: "Reset Token:",
    manualTokenPlaceholder: "Paste reset token from your email",
    submitBtn: "Reset Password",
    resetting: "Updating password…",
    successTitle: "Password Reset Successful!",
    successDesc: "Your password has been securely updated. You can now sign in with your new password.",
    signInBtn: "Continue to Sign In",
    errorTitle: "Reset Failed",
    errorDesc: "The reset token is invalid, expired, or passwords did not match.",
    mismatchError: "Passwords do not match.",
    lengthError: "Password must be at least 8 characters.",
    tokenRequiredError: "Reset token is required.",
    requestNewPrompt: "Need a new password reset link?",
    requestEmailPlaceholder: "Enter your registered email",
    requestBtn: "Send Reset Link",
    requesting: "Sending…",
    requestSuccess: "A password reset link has been sent to your email!",
  },
  km: {
    backHome: "ត្រឡប់ទៅទំព័រដើម",
    title: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
    subtitle: "បង្កើតពាក្យសម្ងាត់សុវត្ថិភាពថ្មីសម្រាប់គណនី NEXA របស់អ្នក។",
    newPasswordLabel: "ពាក្យសម្ងាត់ថ្មី",
    newPasswordPlaceholder: "បញ្ចូលយ៉ាងតិច ៨ តួអក្សរ",
    confirmPasswordLabel: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    confirmPasswordPlaceholder: "បញ្ចូលពាក្យសម្ងាត់ថ្មីម្ដងទៀត",
    manualTokenLabel: "លេខកូដសម្ងាត់ (Token):",
    manualTokenPlaceholder: "បិទភ្ជាប់លេខកូដកំណត់ឡើងវិញពីអ៊ីមែលរបស់អ្នក",
    submitBtn: "ផ្លាស់ប្តូរពាក្យសម្ងាត់",
    resetting: "កំពុងផ្លាស់ប្តូរ…",
    successTitle: "ផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!",
    successDesc: "ពាក្យសម្ងាត់របស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។ អ្នកអាចចូលប្រើឥឡូវនេះបាន។",
    signInBtn: "បន្តទៅកាន់ការចូលគណនី",
    errorTitle: "ការកំណត់ពាក្យសម្ងាត់មិនបានជោគជ័យ",
    errorDesc: "លេខកូដសម្ងាត់មិនត្រឹមត្រូវ ផុតកំណត់ ឬពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នា។",
    mismatchError: "ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ។",
    lengthError: "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៨ តួអក្សរ។",
    tokenRequiredError: "តម្រូវឱ្យមានលេខកូដសម្ងាត់ (Token)។",
    requestNewPrompt: "ត្រូវការតំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មី?",
    requestEmailPlaceholder: "បញ្ចូលអ៊ីមែលដែលបានចុះឈ្មោះ",
    requestBtn: "ផ្ញើតំណភ្ជាប់កំណត់ឡើងវិញ",
    requesting: "កំពុងផ្ញើ…",
    requestSuccess: "តំណភ្ជាប់សម្រាប់កំណត់ពាក្យសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នកហើយ!",
  },
};

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token") || "";
  const { isKhmer } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const t = isKhmer ? copy.km : copy.en;

  const [tokenInput, setTokenInput] = useState(urlToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotFeedback, setForgotFeedback] = useState(null);

  const [resetPassword, { isLoading, isSuccess, isError, data, error }] = useResetPasswordMutation();
  const [forgotPassword, forgotState] = useForgotPasswordMutation();

  const activeToken = urlToken || tokenInput;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!activeToken.trim()) {
      setValidationError(t.tokenRequiredError);
      return;
    }

    if (newPassword.length < 8) {
      setValidationError(t.lengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t.mismatchError);
      return;
    }

    try {
      await resetPassword({
        token: activeToken.trim(),
        newPassword,
        confirmPassword,
      }).unwrap();
    } catch (err) {
      // Handled via RTK Query isError
    }
  };

  const handleRequestNewLink = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotFeedback({ ok: false, message: "Please enter a valid email address." });
      return;
    }
    setForgotFeedback(null);
    try {
      await forgotPassword({ email: forgotEmail.trim() }).unwrap();
      setForgotFeedback({ ok: true, message: t.requestSuccess });
      setForgotEmail("");
    } catch (err) {
      const errMsg = err?.data?.message || err?.error || "Could not send reset link. Please try again.";
      setForgotFeedback({ ok: false, message: errMsg });
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
          <BrandLogo alt="NEXA" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 no-underline ${
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
          {/* SUCCESS STATE */}
          {isSuccess ? (
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
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 mb-3 border border-emerald-500/20">
                  <Sparkles size={13} /> {t.successTitle}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-500">
                  {t.successTitle}
                </h1>
                <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
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
          ) : (
            /* FORM STATE */
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-brand-primary flex items-center justify-center">
                  <Lock size={32} />
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.title}</h1>
                <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  {t.subtitle}
                </p>
              </div>

              {(validationError || isError) && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-left flex items-start gap-2">
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{validationError || error?.data?.message || error?.error || t.errorDesc}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Manual Token Input (Only if not already in URL) */}
                {!urlToken && (
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 opacity-80">
                      {t.manualTokenLabel}
                    </label>
                    <div className="relative">
                      <KeyRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder={t.manualTokenPlaceholder}
                        required
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono text-xs transition-all ${
                          darkMode
                            ? "bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500"
                            : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    {t.newPasswordLabel}
                  </label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t.newPasswordPlaceholder}
                      required
                      minLength={8}
                      className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                        darkMode
                          ? "bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500"
                          : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    {t.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      required
                      minLength={8}
                      className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                        darkMode
                          ? "bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500"
                          : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  <span>{isLoading ? t.resetting : t.submitBtn}</span>
                </button>
              </form>

              {/* Request New Link Drawer */}
              <div className={`p-4 rounded-2xl border text-left space-y-3 ${
                darkMode ? "bg-zinc-800/50 border-zinc-700/60" : "bg-slate-50 border-slate-200"
              }`}>
                <h4 className="text-xs font-semibold flex items-center gap-2">
                  <Mail size={14} className="text-brand-primary" />
                  <span>{t.requestNewPrompt}</span>
                </h4>
                <form onSubmit={handleRequestNewLink} className="flex gap-2">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={t.requestEmailPlaceholder}
                    required
                    className={`flex-1 px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                      darkMode
                        ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={forgotState.isLoading}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                  >
                    {forgotState.isLoading ? t.requesting : t.requestBtn}
                  </button>
                </form>
                {forgotFeedback && (
                  <p className={`text-xs font-medium ${forgotFeedback.ok ? "text-emerald-500" : "text-red-500"}`}>
                    {forgotFeedback.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 text-sm font-medium hover:underline ${
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
      <footer className="w-full text-center py-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} NEXA. All rights reserved.
      </footer>
    </div>
  );
}
