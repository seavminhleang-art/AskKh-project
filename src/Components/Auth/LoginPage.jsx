import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router";

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
} from "firebase/auth";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

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

import loginIllustration from "../../assets/Website/login-illustration.png";

const translations = {
  km: {
    back:
      "ត្រឡប់ទៅគេហទំព័រ",

    title:
      "ចូលទៅកាន់គណនីរបស់អ្នក",

    email:
      "អ៊ីមែល",

    emailPlaceholder:
      "បញ្ចូលអ៊ីមែលរបស់អ្នក",

    password:
      "ពាក្យសម្ងាត់",

    passwordPlaceholder:
      "បញ្ចូលពាក្យសម្ងាត់",

    remember:
      "ចងចាំខ្ញុំ",

    forgot:
      "ភ្លេចពាក្យសម្ងាត់?",

    login:
      "ចូលគណនី",

    loggingIn:
      "កំពុងចូល...",

    continueWith:
      "ឬបន្តជាមួយ",

    google:
      "Google",

    github:
      "GitHub",

    noAccount:
      "មិនទាន់មានគណនី?",

    signup:
      "ចុះឈ្មោះ",

    resetSending:
      "កំពុងផ្ញើ...",

    enterEmail:
      "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។",

    invalidEmail:
      "សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។",

    emailMissingAt:
      "អ៊ីមែលត្រូវមានសញ្ញា @",

    gmailSuggestion:
      "តើអ្នកចង់សរសេរ @gmail.com មែនទេ?",

    invalidEmailFormat:
      "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ (ឧ. name@example.com)",

    emailDomainExtension:
      "Domain របស់អ៊ីមែលត្រូវមានផ្នែកបន្ថែមដូចជា .com (ឧ. gmail.com)",

    enterPassword:
      "សូមបញ្ចូលពាក្យសម្ងាត់។",

    wrongCredentials:
      "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។",

    disabled:
      "គណនីនេះត្រូវបានបិទដំណើរការ។",

    network:
      "មានបញ្ហាបណ្តាញ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។",

    tooMany:
      "ការព្យាយាមច្រើនពេក។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។",

    loginFailed:
      "ការចូលគណនីបរាជ័យ។",

    googleFailed:
      "ការចូលតាម Google បរាជ័យ។",

    githubFailed:
      "ការចូលតាម GitHub បរាជ័យ។",

    githubDisabled:
      "GitHub Authentication មិនទាន់បានបើកក្នុង Firebase។",

    accountExists:
      "អ៊ីមែលនេះមានគណនីរួចហើយជាមួយវិធីចូលផ្សេង។",

    popupBlocked:
      "Browser បានបិទ authentication popup។",

    resetSent:
      "បានផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ឡើងវិញ។",

    enterEmailBeforeReset:
      "សូមបញ្ចូលអ៊ីមែលជាមុនសិន។",

    resetFailed:
      "មិនអាចផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ។",

    welcome:
      "សូមស្វាគមន៍",

    successTitle:
      "ចូលគណនីជោគជ័យ",

    errorTitle:
      "មានបញ្ហា",

    infoTitle:
      "ព័ត៌មាន",

    resetTitle:
      "បានផ្ញើអ៊ីមែល",
  },

  en: {
    back:
      "Back to website",

    title:
      "Sign in to your account",

    email:
      "Email",

    emailPlaceholder:
      "example@gmail.com",

    password:
      "Password",

    passwordPlaceholder:
      "Enter your password",

    remember:
      "Remember me",

    forgot:
      "Forgot password?",

    login:
      "Login",

    loggingIn:
      "Signing in...",

    continueWith:
      "or continue with",

    google:
      "Google",

    github:
      "GitHub",

    noAccount:
      "Don't have an account?",

    signup:
      "Sign up",

    resetSending:
      "Sending...",

    enterEmail:
      "Please enter your email.",

    invalidEmail:
      "Please enter a valid email.",

    emailMissingAt:
      "Email must include @",

    gmailSuggestion:
      "Did you mean @gmail.com?",

    invalidEmailFormat:
      "Invalid email format (e.g. name@example.com)",

    emailDomainExtension:
      "Email domain must include an extension like .com (e.g. gmail.com)",

    enterPassword:
      "Please enter your password.",

    wrongCredentials:
      "Incorrect email or password.",

    disabled:
      "This account has been disabled.",

    network:
      "Network error. Please check your internet connection.",

    tooMany:
      "Too many attempts. Please try again later.",

    loginFailed:
      "Login failed. Please try again.",

    googleFailed:
      "Google login failed.",

    githubFailed:
      "GitHub login failed.",

    githubDisabled:
      "GitHub Authentication is not enabled in Firebase.",

    accountExists:
      "An account already exists with this email using another sign-in method.",

    popupBlocked:
      "Your browser blocked the authentication popup.",

    resetSent:
      "Password reset email sent. Please check your inbox.",

    enterEmailBeforeReset:
      "Enter your email first.",

    resetFailed:
      "Unable to send password reset email.",

    welcome:
      "Welcome",

    successTitle:
      "Login successful",

    errorTitle:
      "Something went wrong",

    infoTitle:
      "Information",

    resetTitle:
      "Email sent",
  },
};

const createEmailSchema = (t) =>
  z
    .string()
    .trim()
    .min(
      1,
      t.enterEmail,
    )
    .superRefine(
      (
        value,
        ctx,
      ) => {
        if (!value) {
          return;
        }

        if (
          !value.includes(
            "@",
          )
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.emailMissingAt,
          });

          return;
        }

        const parts =
          value.split(
            "@",
          );

        if (
          parts.length !== 2
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.invalidEmailFormat,
          });

          return;
        }

        const [
          localPart,
          domain,
        ] = parts;

        if (
          !localPart ||
          !domain
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.invalidEmail,
          });

          return;
        }

        if (
          domain.endsWith(
            ".",
          )
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.emailDomainExtension,
          });

          return;
        }

        const gmailTypoPattern =
          /^gmail\.(co|con|cmo)$/i;

        if (
          gmailTypoPattern.test(
            domain,
          )
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.gmailSuggestion,
          });

          return;
        }

        const domainParts =
          domain.split(
            ".",
          );

        const extension =
          domainParts[
            domainParts.length -
              1
          ];

        if (
          domainParts.length <
            2 ||
          !extension ||
          extension.length < 2
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.invalidEmailFormat,
          });

          return;
        }

        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (
          !emailPattern.test(
            value,
          )
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              t.invalidEmail,
          });
        }
      },
    );

const createLoginSchema = (
  t,
) =>
  z.object({
    email:
      createEmailSchema(
        t,
      ),

    password: z
      .string()
      .min(
        1,
        t.enterPassword,
      ),

    rememberMe: z
      .boolean()
      .optional(),
  });

export default function LoginPage() {
  const {
    language,
    isKhmer,
  } = useLanguage();

  const t =
    translations[
      language
    ];

  const loginSchema =
    useMemo(
      () =>
        createLoginSchema(
          t,
        ),
      [t],
    );

  const {
    register,
    handleSubmit,
    getValues,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(
        loginSchema,
      ),

    mode: "onBlur",

    reValidateMode:
      "onChange",

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

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
    resetLoading,
    setResetLoading,
  ] = useState(false);

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

  const showLoginSuccess = (
    user,
  ) => {
    showToast({
      status:
        "success",

      title:
        t.successTitle,

      description:
        `${t.welcome}${
          user?.displayName
            ? `, ${user.displayName}`
            : ""
        }!`,
    });
  };

  const getFirebaseErrorMessage =
    (error) => {
      switch (
        error.code
      ) {
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

  const onSubmit =
    async (data) => {
      try {
        await setPersistence(
          auth,

          data.rememberMe
            ? browserLocalPersistence
            : browserSessionPersistence,
        );

        const result =
          await signInWithEmailAndPassword(
            auth,
            data.email
              .trim()
              .toLowerCase(),
            data.password,
          );

        showLoginSuccess(
          result.user,
        );
      } catch (error) {
        console.error(
          "Login error:",
          error,
        );

        notifyError(
          getFirebaseErrorMessage(
            error,
          ),
        );
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
      provider ===
        "GitHub" &&
      error.code ===
        "auth/operation-not-allowed"
    ) {
      notifyError(
        t.githubDisabled,
      );

      return;
    }

    notifyError(
      provider ===
        "Google"
        ? t.googleFailed
        : t.githubFailed,
    );
  };

  const handleForgotPassword =
    async () => {
      const email =
        getValues(
          "email",
        )
          ?.trim()
          .toLowerCase();

      if (!email) {
        showToast({
          status:
            "info",

          title:
            t.infoTitle,

          description:
            t.enterEmailBeforeReset,
        });

        return;
      }

      const result =
        createEmailSchema(
          t,
        ).safeParse(
          email,
        );

      if (
        !result.success
      ) {
        notifyError(
          result.error
            .issues[0]
            ?.message ||
            t.invalidEmail,
        );

        return;
      }

      try {
        setResetLoading(
          true,
        );

        await sendPasswordResetEmail(
          auth,
          email,
        );

        showToast({
          status:
            "success",

          title:
            t.resetTitle,

          description:
            t.resetSent,
        });
      } catch (error) {
        console.error(
          "Password reset error:",
          error,
        );

        switch (
          error.code
        ) {
          case "auth/invalid-email":
            notifyError(
              t.invalidEmail,
            );
            break;

          case "auth/too-many-requests":
            notifyError(
              t.tooMany,
            );
            break;

          case "auth/network-request-failed":
            notifyError(
              t.network,
            );
            break;

          default:
            notifyError(
              t.resetFailed,
            );
        }
      } finally {
        setResetLoading(
          false,
        );
      }
    };

  return (
    <>
      <AnimatedToastStack
        toasts={
          toasts
        }
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
              size={
                18
              }
            />

            <span>
              {
                t.back
              }
            </span>
          </Link>

          <div className="auth-illustration-wrapper">
            <img
              src={
                loginIllustration
              }
              alt="AskKH login illustration"
              className="auth-illustration login-illustration"
            />
          </div>
        </section>

        <section className="auth-form-section">
          <div className="login-form-container">
            <div className="auth-heading">
              <h1>
                {
                  t.title
                }
              </h1>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit(
                onSubmit,
              )}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="login-email">
                  {
                    t.email
                  }

                  <span>
                    *
                  </span>
                </label>

                <div
                  className={`input-wrapper ${
                    errors.email
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <Mail
                    size={
                      19
                    }
                    className="input-icon"
                  />

                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder={
                      t.emailPlaceholder
                    }
                    aria-invalid={
                      errors.email
                        ? "true"
                        : "false"
                    }
                    {...register(
                      "email",
                    )}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      errors
                        .email
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="login-password">
                  {
                    t.password
                  }

                  <span>
                    *
                  </span>
                </label>

                <div
                  className={`input-wrapper ${
                    errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <LockKeyhole
                    size={
                      19
                    }
                    className="input-icon"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder={
                      t.passwordPlaceholder
                    }
                    aria-invalid={
                      errors.password
                        ? "true"
                        : "false"
                    }
                    {...register(
                      "password",
                    )}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
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
                        size={
                          19
                        }
                      />
                    ) : (
                      <EyeOff
                        size={
                          19
                        }
                      />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      errors
                        .password
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="login-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register(
                      "rememberMe",
                    )}
                  />

                  <span className="custom-checkbox" />

                  <span className="checkbox-text">
                    {
                      t.remember
                    }
                  </span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={
                    handleForgotPassword
                  }
                  disabled={
                    resetLoading
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
                disabled={
                  isSubmitting
                }
              >
                {isSubmitting
                  ? t.loggingIn
                  : t.login}
              </button>

              <div className="auth-divider">
                <span />

                <p>
                  {
                    t.continueWith
                  }
                </p>

                <span />
              </div>

              <div className="social-buttons">
                <GoogleComponent
                  label={
                    t.google
                  }
                  onSuccess={
                    showLoginSuccess
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
                  onSuccess={
                    showLoginSuccess
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

              <p className="auth-switch-text">
                {
                  t.noAccount
                }

                <Link to="/register">
                  {
                    t.signup
                  }
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}