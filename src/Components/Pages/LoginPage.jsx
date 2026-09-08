import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../Firebase/firebase.js";

import { useLanguage } from "../Language/LanguageContext.jsx";

import loginIllustration from "../../assets/Website/login-illustration.png";

const translations = {
  km: {
    back: "ត្រឡប់ទៅគេហទំព័រ",
    title: "ចូលទៅកាន់គណនីរបស់អ្នក",
    email: "អ៊ីមែល",
    emailPlaceholder: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
    password: "ពាក្យសម្ងាត់",
    passwordPlaceholder: "បញ្ចូលពាក្យសម្ងាត់",
    remember: "ចងចាំខ្ញុំ",
    forgot: "ភ្លេចពាក្យសម្ងាត់?",
    login: "ចូលគណនី",
    loggingIn: "កំពុងចូល...",
    continueWith: "ឬបន្តជាមួយ",
    google: "Google",
    github: "Github",
    noAccount: "មិនទាន់មានគណនី?",
    signup: "ចុះឈ្មោះ",
    resetSending: "កំពុងផ្ញើ...",

    enterEmail: "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។",
    enterPassword: "សូមបញ្ចូលពាក្យសម្ងាត់។",
    invalidEmail: "សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។",
    wrongCredentials:
      "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។",
    disabled:
      "គណនីនេះត្រូវបានបិទដំណើរការ។",
    network:
      "មានបញ្ហាបណ្តាញ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។",
    tooMany:
      "ការព្យាយាមច្រើនពេក។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។",
    loginFailed:
      "ការចូលគណនីបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។",
    resetSent:
      "បានផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ឡើងវិញ។ សូមពិនិត្យប្រអប់សារ។",
    enterEmailBeforeReset:
      "សូមបញ្ចូលអ៊ីមែលជាមុនសិន។",
    googleFailed:
      "ការចូលតាម Google បរាជ័យ។",
    popupBlocked:
      "Browser បានបិទ Google popup។ សូមអនុញ្ញាត popup។",
    githubDisabled:
      "GitHub Authentication មិនទាន់បានបើកទេ។",
    welcome: "សូមស្វាគមន៍",
  },

  en: {
    back: "Back to website",
    title: "Sign in to your account",
    email: "Email",
    emailPlaceholder: "example@gmail.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    login: "Login",
    loggingIn: "Signing in...",
    continueWith: "or continue with",
    google: "Google",
    github: "Github",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    resetSending: "Sending...",

    enterEmail: "Please enter your email.",
    enterPassword: "Please enter your password.",
    invalidEmail: "Please enter a valid email.",
    wrongCredentials:
      "Incorrect email or password.",
    disabled: "This account has been disabled.",
    network:
      "Network error. Please check your internet connection.",
    tooMany:
      "Too many attempts. Please try again later.",
    loginFailed:
      "Login failed. Please try again.",
    resetSent:
      "Password reset email sent. Please check your inbox.",
    enterEmailBeforeReset:
      "Enter your email first.",
    googleFailed:
      "Google login failed.",
    popupBlocked:
      "Your browser blocked the Google popup.",
    githubDisabled:
      "GitHub authentication is not enabled yet.",
    welcome: "Welcome",
  },
};

const LoginPage = () => {
  const { language, isKhmer } = useLanguage();

  const t = translations[language];

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        return t.invalidEmail;

      case "auth/user-disabled":
        return t.disabled;

      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return t.wrongCredentials;

      case "auth/network-request-failed":
        return t.network;

      case "auth/too-many-requests":
        return t.tooMany;

      default:
        return t.loginFailed;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      alert(t.enterEmail);
      return;
    }

    if (!formData.password) {
      alert(t.enterPassword);
      return;
    }

    try {
      setLoading(true);

      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence,
      );

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password,
        );

      const user = userCredential.user;

      alert(
        `${t.welcome}${
          user.displayName
            ? `, ${user.displayName}`
            : ""
        }!`,
      );
    } catch (error) {
      console.error(error);

      alert(
        getFirebaseErrorMessage(error),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider,
      );

      alert(
        `${t.welcome}${
          result.user.displayName
            ? `, ${result.user.displayName}`
            : ""
        }!`,
      );
    } catch (error) {
      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {
        return;
      }

      if (
        error.code ===
        "auth/popup-blocked"
      ) {
        alert(t.popupBlocked);
        return;
      }

      alert(t.googleFailed);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword =
    async () => {
      const email = formData.email.trim();

      if (!email) {
        alert(t.enterEmailBeforeReset);
        return;
      }

      try {
        setResetLoading(true);

        await sendPasswordResetEmail(
          auth,
          email,
        );

        alert(t.resetSent);
      } catch (error) {
        console.error(error);

        alert(
          error.code === "auth/invalid-email"
            ? t.invalidEmail
            : t.loginFailed,
        );
      } finally {
        setResetLoading(false);
      }
    };

  return (
    <main
      className={`auth-page ${
        isKhmer ? "font-khmer" : "font-brand"
      }`}
    >
      <section className="auth-visual-section">
        <Link
          to="/"
          className="back-button"
        >
          <ArrowLeft size={18} />

          <span>{t.back}</span>
        </Link>

        <div className="auth-illustration-wrapper">
          <img
            src={loginIllustration}
            alt=""
            className="auth-illustration login-illustration"
          />
        </div>
      </section>

      <section className="auth-form-section">
        <div className="login-form-container">
          <div className="auth-heading">
            <h1>{t.title}</h1>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="login-email">
                {t.email} <span>*</span>
              </label>

              <div className="input-wrapper">
                <Mail
                  size={19}
                  className="input-icon"
                />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder={
                    t.emailPlaceholder
                  }
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                {t.password} <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  className="input-icon"
                />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder={
                    t.passwordPlaceholder
                  }
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous,
                    )
                  }
                >
                  {showPassword ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked,
                    )
                  }
                />

                <span className="custom-checkbox" />

                <span className="checkbox-text">
                  {t.remember}
                </span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={
                  handleForgotPassword
                }
              >
                {resetLoading
                  ? t.resetSending
                  : t.forgot}
              </button>
            </div>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading
                ? t.loggingIn
                : t.login}
            </button>

            <div className="auth-divider">
              <span />
              <p>{t.continueWith}</p>
              <span />
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleLogin}
              >
                <Icon
                  icon="flat-color-icons:google"
                  width="24"
                />

                <span>
                  {googleLoading
                    ? "..."
                    : t.google}
                </span>
              </button>

              <button
                type="button"
                className="social-button"
                onClick={() =>
                  alert(t.githubDisabled)
                }
              >
                <Icon
                  icon="mdi:github"
                  width="25"
                />

                <span>{t.github}</span>
              </button>
            </div>

            <p className="auth-switch-text">
              {t.noAccount}

              <Link to="/register">
                {t.signup}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;