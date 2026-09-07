import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../Firebase/firebase.js";

import registerIllustration from "../../assets/Website/register-illustration.png";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      case "auth/email-already-in-use":
        return "This email is already registered.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      default:
        return error.message || "Registration failed. Please try again.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.firstName.trim()) {
      alert("Please enter your firstname.");
      return;
    }

    if (!formData.lastName.trim()) {
      alert("Please enter your lastname.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and confirm password do not match.");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      });

      console.log("Firebase registered user:", user);

      /*
       * createUserWithEmailAndPassword automatically signs the user in.
       * For this flow, we sign them out and send them to Login
       * so you can clearly test both Register and Login.
       */
      await signOut(auth);

      alert("Account created successfully. You can now log in.");

      navigate("/login");
    } catch (error) {
      console.error("Firebase registration error:", error);

      alert(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(auth, googleProvider);

      console.log("Google user:", result.user);

      alert(`Welcome ${result.user.displayName || "to AskKH"}!`);

      /*
       * We keep the Google user signed in.
       * Later you can navigate to your real homepage/dashboard here.
       */
    } catch (error) {
      console.error("Google registration error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      if (error.code === "auth/popup-blocked") {
        alert("Your browser blocked the Google popup. Please allow popups.");
        return;
      }

      alert("Google sign up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubRegister = () => {
    alert(
      "GitHub authentication is not enabled yet. Please use Email/Password or Google."
    );
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
            src={registerIllustration}
            alt="Registration illustration"
            className="auth-illustration register-illustration"
          />
        </div>
      </section>

      <section className="auth-form-section register-section">
        <div className="register-form-container">
          <div className="auth-heading register-heading">
            <h1>Create your account</h1>

            <p>
              Already have an account?
              <Link to="/login">Login</Link>
            </p>
          </div>

          <form
            className="auth-form register-form"
            onSubmit={handleSubmit}
          >
            <div className="name-grid">
              <div className="form-group">
                <label htmlFor="first-name">
                  Firstname <span>*</span>
                </label>

                <div className="input-wrapper no-icon">
                  <input
                    id="first-name"
                    type="text"
                    name="firstName"
                    placeholder="Enter your firstname"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="last-name">
                  Lastname <span>*</span>
                </label>

                <div className="input-wrapper no-icon">
                  <input
                    id="last-name"
                    type="text"
                    name="lastName"
                    placeholder="Enter your lastname"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-email">
                Email <span>*</span>
              </label>

              <div className="input-wrapper">
                <Mail
                  size={19}
                  strokeWidth={1.8}
                  className="input-icon"
                />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">
                Password <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  strokeWidth={1.8}
                  className="input-icon"
                />

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
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

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm Password <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  strokeWidth={1.8}
                  className="input-icon"
                />

                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <Eye size={19} strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={19} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-checkbox">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(event) =>
                  setAgreeToTerms(event.target.checked)
                }
              />

              <span className="custom-checkbox" />

              <span className="checkbox-text">
                I agree to the
                <a href="#terms">Term of Service</a>
                and
                <a href="#privacy">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            <div className="auth-divider">
              <span />
              <p>or sign up with</p>
              <span />
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleRegister}
                disabled={googleLoading}
              >
                <Icon
                  icon="flat-color-icons:google"
                  width="24"
                  height="24"
                />

                <span>
                  {googleLoading ? "Connecting..." : "Google"}
                </span>
              </button>

              <button
                type="button"
                className="social-button"
                onClick={handleGithubRegister}
              >
                <Icon
                  icon="mdi:github"
                  width="25"
                  height="25"
                />

                <span>Github</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;