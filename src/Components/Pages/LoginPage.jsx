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
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../Firebase/firebase.js";

import loginIllustration from "../../assets/Website/login-illustration.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [formData, setFormData] = useState({
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
        return "Please enter a valid email address.";

      case "auth/user-disabled":
        return "This account has been disabled.";

      case "auth/invalid-credential":
        return "Incorrect email or password.";

      case "auth/user-not-found":
        return "No account was found with this email.";

      case "auth/wrong-password":
        return "Incorrect password.";

      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return error.message || "Login failed. Please try again.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.password) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Remember me checked:
       * Firebase keeps the user signed in after browser restart.
       *
       * Not checked:
       * User stays signed in only for this browser session.
       */
      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const user = userCredential.user;

      console.log("Firebase logged-in user:", user);

      alert(
        `Welcome back${
          user.displayName ? `, ${user.displayName}` : ""
        }!`
      );

      /*
       * Later, when your team builds the real homepage/dashboard,
       * you can add:
       *
       * navigate("/");
       *
       * Do NOT add it yet if "/" currently redirects back to /login.
       */
    } catch (error) {
      console.error("Firebase login error:", error);

      alert(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      console.log("Google logged-in user:", result.user);

      alert(
        `Welcome${
          result.user.displayName
            ? `, ${result.user.displayName}`
            : ""
        }!`
      );
    } catch (error) {
      console.error("Google login error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      if (error.code === "auth/popup-blocked") {
        alert(
          "Your browser blocked the Google popup. Please allow popups and try again."
        );
        return;
      }

      if (
        error.code ===
        "auth/account-exists-with-different-credential"
      ) {
        alert(
          "An account already exists with this email using another sign-in method."
        );
        return;
      }

      alert("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = () => {
    alert(
      "GitHub authentication is not enabled yet. Please use Email/Password or Google."
    );
  };

  const handleForgotPassword = async () => {
    const email = formData.email.trim();

    if (!email) {
      alert(
        "Enter your email address first, then click Forgot password."
      );
      return;
    }

    try {
      setResetLoading(true);

      await sendPasswordResetEmail(auth, email);

      alert(
        "Password reset email sent. Please check your inbox."
      );
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
        return;
      }

      if (error.code === "auth/user-not-found") {
        alert("No account was found with this email.");
        return;
      }

      alert(
        "Unable to send password reset email. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual-section">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} strokeWidth={2} />
          <span>Back to website</span>
        </Link>

        <div className="auth-illustration-wrapper">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="auth-illustration login-illustration"
          />
        </div>
      </section>

      <section className="auth-form-section">
        <div className="login-form-container">
          <div className="auth-heading">
            <h1>Sign in to your account</h1>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="login-email">
                Email <span>*</span>
              </label>

              <div className="input-wrapper">
                <Mail
                  size={19}
                  strokeWidth={1.8}
                  className="input-icon"
                />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                Password <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  strokeWidth={1.8}
                  className="input-icon"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <Eye size={19} strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={19} strokeWidth={1.8} />
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
                    setRememberMe(event.target.checked)
                  }
                />

                <span className="custom-checkbox" />

                <span className="checkbox-text">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={resetLoading}
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot password?"}
              </button>
            </div>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="auth-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <Icon
                  icon="flat-color-icons:google"
                  width="24"
                  height="24"
                />

                <span>
                  {googleLoading
                    ? "Connecting..."
                    : "Google"}
                </span>
              </button>

              <button
                type="button"
                className="social-button"
                onClick={handleGithubLogin}
              >
                <Icon
                  icon="mdi:github"
                  width="25"
                  height="25"
                />

                <span>Github</span>
              </button>
            </div>

            <p className="auth-switch-text">
              Don&apos;t have an account?
              <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;