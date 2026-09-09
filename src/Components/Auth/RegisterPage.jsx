import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  auth,
} from "../Firebase/firebase.js";

import {
  useLanguage,
} from "../Language/LanguageContext.jsx";

import GoogleComponent from "../oauth/GoogleComponent.jsx";
import GithubComponent from "../oauth/GithubComponent.jsx";

import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "@/components/motion/animated-toast-stack";

import registerIllustration from "../../assets/Website/register-illustration.png";

const translations = {
  km: {
    back:
      "ត្រឡប់ទៅគេហទំព័រ",

    title:
      "បង្កើតគណនីរបស់អ្នក",

    alreadyAccount:
      "មានគណនីរួចហើយ?",

    login:
      "ចូលគណនី",

    firstname:
      "នាមខ្លួន",

    firstnamePlaceholder:
      "បញ្ចូលនាមខ្លួន",

    lastname:
      "នាមត្រកូល",

    lastnamePlaceholder:
      "បញ្ចូលនាមត្រកូល",

    email:
      "អ៊ីមែល",

    emailPlaceholder:
      "បញ្ចូលអ៊ីមែលរបស់អ្នក",

    password:
      "ពាក្យសម្ងាត់",

    passwordPlaceholder:
      "បញ្ចូលពាក្យសម្ងាត់",

    confirmPassword:
      "បញ្ជាក់ពាក្យសម្ងាត់",

    confirmPlaceholder:
      "បញ្ចូលពាក្យសម្ងាត់ម្ដងទៀត",

    agree:
      "ខ្ញុំយល់ព្រមនឹង",

    terms:
      "លក្ខខណ្ឌនៃសេវាកម្ម",

    and:
      "និង",

    privacy:
      "គោលការណ៍ឯកជនភាព",

    register:
      "ចុះឈ្មោះ",

    creating:
      "កំពុងបង្កើតគណនី...",

    signupWith:
      "ឬចុះឈ្មោះជាមួយ",

    google:
      "Google",

    github:
      "GitHub",

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
      "ការចុះឈ្មោះបរាជ័យ។",

    googleFailed:
      "ការចុះឈ្មោះតាម Google បរាជ័យ។",

    githubFailed:
      "ការចុះឈ្មោះតាម GitHub បរាជ័យ។",

    githubDisabled:
      "GitHub Authentication មិនទាន់បានបើកក្នុង Firebase។",

    accountExists:
      "អ៊ីមែលនេះមានគណនីរួចហើយជាមួយវិធីចូលផ្សេង។",

    popupBlocked:
      "Browser បានបិទ authentication popup។",

    successTitle:
      "បង្កើតគណនីជោគជ័យ",

    errorTitle:
      "មានបញ្ហា",

    googleSuccess:
      "ចូលតាម Google បានជោគជ័យ។",

    githubSuccess:
      "ចូលតាម GitHub បានជោគជ័យ។",
  },

  en: {
    back:
      "Back to website",

    title:
      "Create your account",

    alreadyAccount:
      "Already have an account?",

    login:
      "Login",

    firstname:
      "Firstname",

    firstnamePlaceholder:
      "Enter your firstname",

    lastname:
      "Lastname",

    lastnamePlaceholder:
      "Enter your lastname",

    email:
      "Email",

    emailPlaceholder:
      "Enter your email address",

    password:
      "Password",

    passwordPlaceholder:
      "Enter your password",

    confirmPassword:
      "Confirm Password",

    confirmPlaceholder:
      "Confirm your password",

    agree:
      "I agree to the",

    terms:
      "Terms of Service",

    and:
      "and",

    privacy:
      "Privacy Policy",

    register:
      "Register",

    creating:
      "Creating account...",

    signupWith:
      "or sign up with",

    google:
      "Google",

    github:
      "GitHub",

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

    githubFailed:
      "GitHub sign up failed.",

    githubDisabled:
      "GitHub Authentication is not enabled in Firebase.",

    accountExists:
      "An account already exists with this email using another sign-in method.",

    popupBlocked:
      "Your browser blocked the authentication popup.",

    successTitle:
      "Account created",

    errorTitle:
      "Something went wrong",

    googleSuccess:
      "Google authentication successful.",

    githubSuccess:
      "GitHub authentication successful.",
  },
};

export default function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    language,
    isKhmer,
  } = useLanguage();

  const t =
    translations[language];

  const {
    toasts,
    showToast,
    dismissToast,
  } =
    useAnimatedToastStack({
      defaultDuration: 4200,
      limit: 4,
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    agreeToTerms,
    setAgreeToTerms,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const notifyError = (
    description,
  ) => {
    showToast({
      status: "error",
      title:
        t.errorTitle,
      description,
    });
  };

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      }),
    );
  };

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    if (
      !formData.firstName.trim()
    ) {
      notifyError(
        t.firstRequired,
      );

      return;
    }

    if (
      !formData.lastName.trim()
    ) {
      notifyError(
        t.lastRequired,
      );

      return;
    }

    if (
      !formData.email.trim()
    ) {
      notifyError(
        t.emailRequired,
      );

      return;
    }

    if (
      formData.password.length <
      6
    ) {
      notifyError(
        t.passwordLength,
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      notifyError(
        t.passwordMismatch,
      );

      return;
    }

    if (!agreeToTerms) {
      notifyError(
        t.termsRequired,
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password,
        );

      await updateProfile(
        result.user,
        {
          displayName:
            `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        },
      );

      await signOut(auth);

      showToast({
        status:
          "success",

        title:
          t.successTitle,

        description:
          t.accountCreated,

        duration:
          3000,
      });

      window.setTimeout(
        () => {
          navigate(
            "/login",
          );
        },
        1500,
      );
    } catch (error) {
      console.error(
        "Registration error:",
        error,
      );

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        notifyError(
          t.emailExists,
        );

        return;
      }

      if (
        error.code ===
        "auth/invalid-email"
      ) {
        notifyError(
          t.invalidEmail,
        );

        return;
      }

      notifyError(
        t.registerFailed,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthError = (
    error,
    provider,
  ) => {
    console.error(
      `${provider} authentication error:`,
      error,
    );

    if (
      error.code ===
      "auth/popup-blocked"
    ) {
      notifyError(
        t.popupBlocked,
      );

      return;
    }

    if (
      error.code ===
      "auth/account-exists-with-different-credential"
    ) {
      notifyError(
        t.accountExists,
      );

      return;
    }

    if (
      provider === "GitHub" &&
      error.code ===
        "auth/operation-not-allowed"
    ) {
      notifyError(
        t.githubDisabled,
      );

      return;
    }

    notifyError(
      provider === "Google"
        ? t.googleFailed
        : t.githubFailed,
    );
  };

  const handleOAuthSuccess = (
    provider,
  ) => {
    showToast({
      status:
        "success",

      title:
        t.successTitle,

      description:
        provider ===
        "Google"
          ? t.googleSuccess
          : t.githubSuccess,
    });
  };

  return (
    <>
      <AnimatedToastStack
        toasts={toasts}
        onDismiss={
          dismissToast
        }
        position="top-right"
        fixed
        maxVisible={4}
      />

      <main
        className={`auth-page ${
          isKhmer
            ? "font-khmer"
            : "font-brand"
        }`}
      >
        <section className="auth-visual-section">
          <Link
            to="/"
            className="back-button"
          >
            <ArrowLeft
              size={18}
            />

            <span>
              {t.back}
            </span>
          </Link>

          <div className="auth-illustration-wrapper">
            <img
              src={
                registerIllustration
              }
              alt="AskKH registration illustration"
              className="auth-illustration register-illustration"
            />
          </div>
        </section>

        <section className="auth-form-section register-section">
          <div className="register-form-container">
            <div className="auth-heading register-heading">
              <h1>
                {t.title}
              </h1>

              <p>
                {
                  t.alreadyAccount
                }

                <Link to="/login">
                  {t.login}
                </Link>
              </p>
            </div>

            <form
              className="auth-form register-form"
              onSubmit={
                handleSubmit
              }
            >
              <div className="name-grid">
                <div className="form-group">
                  <label htmlFor="register-first-name">
                    {
                      t.firstname
                    }

                    <span>
                      *
                    </span>
                  </label>

                  <div className="input-wrapper no-icon">
                    <input
                      id="register-first-name"
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder={
                        t.firstnamePlaceholder
                      }
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-last-name">
                    {
                      t.lastname
                    }

                    <span>
                      *
                    </span>
                  </label>

                  <div className="input-wrapper no-icon">
                    <input
                      id="register-last-name"
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder={
                        t.lastnamePlaceholder
                      }
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email">
                  {t.email}

                  <span>
                    *
                  </span>
                </label>

                <div className="input-wrapper">
                  <Mail
                    size={19}
                    className="input-icon"
                  />

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={
                      t.emailPlaceholder
                    }
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">
                  {t.password}

                  <span>
                    *
                  </span>
                </label>

                <div className="input-wrapper">
                  <LockKeyhole
                    size={19}
                    className="input-icon"
                  />

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="new-password"
                    placeholder={
                      t.passwordPlaceholder
                    }
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (
                          previous,
                        ) =>
                          !previous,
                      )
                    }
                  >
                    {showPassword ? (
                      <Eye
                        size={19}
                      />
                    ) : (
                      <EyeOff
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm-password">
                  {
                    t.confirmPassword
                  }

                  <span>
                    *
                  </span>
                </label>

                <div className="input-wrapper">
                  <LockKeyhole
                    size={19}
                    className="input-icon"
                  />

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder={
                      t.confirmPlaceholder
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (
                          previous,
                        ) =>
                          !previous,
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <Eye
                        size={19}
                      />
                    ) : (
                      <EyeOff
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>

              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  checked={
                    agreeToTerms
                  }
                  onChange={(
                    event,
                  ) =>
                    setAgreeToTerms(
                      event.target
                        .checked,
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
                disabled={
                  loading
                }
              >
                {loading
                  ? t.creating
                  : t.register}
              </button>

              <div className="auth-divider">
                <span />

                <p>
                  {
                    t.signupWith
                  }
                </p>

                <span />
              </div>

              <div className="social-buttons">
                <GoogleComponent
                  label={
                    t.google
                  }
                  onSuccess={() =>
                    handleOAuthSuccess(
                      "Google",
                    )
                  }
                  onError={(
                    error,
                  ) =>
                    handleOAuthError(
                      error,
                      "Google",
                    )
                  }
                />

                <GithubComponent
                  label={
                    t.github
                  }
                  onSuccess={() =>
                    handleOAuthSuccess(
                      "GitHub",
                    )
                  }
                  onError={(
                    error,
                  ) =>
                    handleOAuthError(
                      error,
                      "GitHub",
                    )
                  }
                />
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}