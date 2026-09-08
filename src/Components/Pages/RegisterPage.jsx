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
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../Firebase/firebase.js";

import { useLanguage } from "../Language/LanguageContext.jsx";

import registerIllustration from "../../assets/Website/register-illustration.png";

const translations = {
  km: {
    back: "ត្រឡប់ទៅគេហទំព័រ",
    title: "បង្កើតគណនីរបស់អ្នក",
    alreadyAccount: "មានគណនីរួចហើយ?",
    login: "ចូលគណនី",

    firstname: "នាមខ្លួន",
    firstnamePlaceholder: "បញ្ចូលនាមខ្លួន",

    lastname: "នាមត្រកូល",
    lastnamePlaceholder: "បញ្ចូលនាមត្រកូល",

    email: "អ៊ីមែល",
    emailPlaceholder: "បញ្ចូលអ៊ីមែលរបស់អ្នក",

    password: "ពាក្យសម្ងាត់",
    passwordPlaceholder: "បញ្ចូលពាក្យសម្ងាត់",

    confirmPassword:
      "បញ្ជាក់ពាក្យសម្ងាត់",
    confirmPlaceholder:
      "បញ្ចូលពាក្យសម្ងាត់ម្ដងទៀត",

    agree: "ខ្ញុំយល់ព្រមនឹង",
    terms: "លក្ខខណ្ឌនៃសេវាកម្ម",
    and: "និង",
    privacy: "គោលការណ៍ឯកជនភាព",

    register: "ចុះឈ្មោះ",
    creating: "កំពុងបង្កើតគណនី...",

    signupWith: "ឬចុះឈ្មោះជាមួយ",

    google: "Google",
    github: "Github",

    firstRequired:
      "សូមបញ្ចូលនាមខ្លួន។",

    lastRequired:
      "សូមបញ្ចូលនាមត្រកូល។",

    emailRequired:
      "សូមបញ្ចូលអ៊ីមែល។",

    passwordLength:
      "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។",

    passwordMismatch:
      "ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នា។",

    termsRequired:
      "សូមយល់ព្រមនឹងលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព។",

    accountCreated:
      "បង្កើតគណនីបានជោគជ័យ។ ឥឡូវនេះអ្នកអាចចូលគណនីបាន។",

    emailExists:
      "អ៊ីមែលនេះបានចុះឈ្មោះរួចហើយ។",

    invalidEmail:
      "សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។",

    registerFailed:
      "ការចុះឈ្មោះបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។",

    googleFailed:
      "ការចុះឈ្មោះតាម Google បរាជ័យ។",

    githubDisabled:
      "GitHub Authentication មិនទាន់បានបើកទេ។",
  },

  en: {
    back: "Back to website",
    title: "Create your account",
    alreadyAccount:
      "Already have an account?",
    login: "Login",

    firstname: "Firstname",
    firstnamePlaceholder:
      "Enter your firstname",

    lastname: "Lastname",
    lastnamePlaceholder:
      "Enter your lastname",

    email: "Email",
    emailPlaceholder:
      "Enter your email address",

    password: "Password",
    passwordPlaceholder:
      "Enter your password",

    confirmPassword:
      "Confirm Password",
    confirmPlaceholder:
      "Confirm your password",

    agree: "I agree to the",
    terms: "Terms of Service",
    and: "and",
    privacy: "Privacy Policy",

    register: "Register",
    creating: "Creating account...",

    signupWith: "or sign up with",

    google: "Google",
    github: "Github",

    firstRequired:
      "Please enter your firstname.",

    lastRequired:
      "Please enter your lastname.",

    emailRequired:
      "Please enter your email.",

    passwordLength:
      "Password must contain at least 6 characters.",

    passwordMismatch:
      "Password and confirm password do not match.",

    termsRequired:
      "Please agree to the Terms of Service and Privacy Policy.",

    accountCreated:
      "Account created successfully. You can now log in.",

    emailExists:
      "This email is already registered.",

    invalidEmail:
      "Please enter a valid email address.",

    registerFailed:
      "Registration failed. Please try again.",

    googleFailed:
      "Google sign up failed.",

    githubDisabled:
      "GitHub authentication is not enabled yet.",
  },
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const { language, isKhmer } =
    useLanguage();

  const t = translations[language];

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    agreeToTerms,
    setAgreeToTerms,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.firstName.trim()) {
      alert(t.firstRequired);
      return;
    }

    if (!formData.lastName.trim()) {
      alert(t.lastRequired);
      return;
    }

    if (!formData.email.trim()) {
      alert(t.emailRequired);
      return;
    }

    if (formData.password.length < 6) {
      alert(t.passwordLength);
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(t.passwordMismatch);
      return;
    }

    if (!agreeToTerms) {
      alert(t.termsRequired);
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password,
        );

      await updateProfile(
        userCredential.user,
        {
          displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        },
      );

      await signOut(auth);

      alert(t.accountCreated);

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        alert(t.emailExists);
      } else if (
        error.code === "auth/invalid-email"
      ) {
        alert(t.invalidEmail);
      } else {
        alert(t.registerFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister =
    async () => {
      try {
        setGoogleLoading(true);

        await signInWithPopup(
          auth,
          googleProvider,
        );
      } catch (error) {
        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {
          return;
        }

        alert(t.googleFailed);
      } finally {
        setGoogleLoading(false);
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
            src={registerIllustration}
            alt=""
            className="auth-illustration register-illustration"
          />
        </div>
      </section>

      <section className="auth-form-section register-section">
        <div className="register-form-container">
          <div className="auth-heading register-heading">
            <h1>{t.title}</h1>

            <p>
              {t.alreadyAccount}

              <Link to="/login">
                {t.login}
              </Link>
            </p>
          </div>

          <form
            className="auth-form register-form"
            onSubmit={handleSubmit}
          >
            <div className="name-grid">
              <div className="form-group">
                <label>
                  {t.firstname}
                  <span>*</span>
                </label>

                <div className="input-wrapper no-icon">
                  <input
                    type="text"
                    name="firstName"
                    placeholder={
                      t.firstnamePlaceholder
                    }
                    value={
                      formData.firstName
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  {t.lastname}
                  <span>*</span>
                </label>

                <div className="input-wrapper no-icon">
                  <input
                    type="text"
                    name="lastName"
                    placeholder={
                      t.lastnamePlaceholder
                    }
                    value={
                      formData.lastName
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                {t.email} <span>*</span>
              </label>

              <div className="input-wrapper">
                <Mail
                  size={19}
                  className="input-icon"
                />

                <input
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
              <label>
                {t.password}
                <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  className="input-icon"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder={
                    t.passwordPlaceholder
                  }
                  value={
                    formData.password
                  }
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

            <div className="form-group">
              <label>
                {t.confirmPassword}
                <span>*</span>
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={19}
                  className="input-icon"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder={
                    t.confirmPlaceholder
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous,
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-checkbox">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(event) =>
                  setAgreeToTerms(
                    event.target.checked,
                  )
                }
              />

              <span className="custom-checkbox" />

              <span className="checkbox-text">
                {t.agree}

                <a href="#terms">
                  {t.terms}
                </a>

                {t.and}

                <a href="#privacy">
                  {t.privacy}
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading
                ? t.creating
                : t.register}
            </button>

            <div className="auth-divider">
              <span />
              <p>{t.signupWith}</p>
              <span />
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={
                  handleGoogleRegister
                }
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
          </form>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;