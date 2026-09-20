import { toast, ToastContainer } from "react-toastify";
import {
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
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

import {
  loginSuccess,
  setCredentials,
} from "../../features/auth/authSlice.js";

import {
  useLoginMutation,
  useForgotPasswordMutation,
} from "../../features/auth/authApi.js";

import GoogleComponent from "../oauth/GoogleComponent.jsx";
import GithubComponent from "../oauth/GithubComponent.jsx";

import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "@/Components/motion/animated-toast-stack";

import loginIllustration from "../../assets/Website/login-illustration.png";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

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

    showPassword:
      "បង្ហាញពាក្យសម្ងាត់",

    hidePassword:
      "លាក់ពាក្យសម្ងាត់",

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

    emailNotVerified:
      "សូមផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នកជាមុនសិន។ យើងបានផ្ញើតំណផ្ទៀងផ្ទាត់ថ្មីទៅកាន់ប្រអប់សំបុត្ររបស់អ្នក។",

    emailNotVerifiedNoResend:
      "សូមផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នកជាមុនសិន។ មិនអាចផ្ញើតំណផ្ទៀងផ្ទាត់ថ្មីបានទេ—សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។",

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

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

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

    emailNotVerified:
      "Verify your email before signing in. We sent a new verification link to your inbox.",

    emailNotVerifiedNoResend:
      "Verify your email before signing in. We could not send a new verification link; please try again later.",

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    mode: "onSubmit",

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

  const [loginMutation] = useLoginMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    resetLoading,
    setResetLoading,
  ] = useState(false);

  const [oauthLoading, setOauthLoading] = useState(false);

  const notifyError = (
    description,
  ) => {
    toast.error(description, { toastId: "login-error" });
  };

  const showLoginSuccess = async (
    user,
  ) => {
    const tokenResult = await user.getIdTokenResult(true);
    const accessToken = tokenResult.token;
    const role = tokenResult.claims.admin === true ? "admin" : "student";

    dispatch(
      loginSuccess({
        accessToken,
        user: {
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Scholar",
          displayName: user.displayName || user.email?.split("@")[0] || "Scholar",
          email: user.email,
          avatar: user.photoURL || null,
          role,
        },
      }),
    );

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

    navigate(role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
  };

  const showOauthLoginSuccess = async (user) => {
    setOauthLoading(true);
    try {
      await showLoginSuccess(user);
    } finally {
      setOauthLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await loginMutation({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }).unwrap();

      const userObj = {
        id: res.userId,
        name: res.displayName || res.email?.split("@")[0] || "Scholar",
        displayName: res.displayName || res.email?.split("@")[0] || "Scholar",
        email: res.email,
        role: "student",
      };

      dispatch(
        loginSuccess({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: userObj,
        }),
      );

      showToast({
        status: "success",
        title: t.successTitle,
        description: `${t.welcome}${res.displayName ? `, ${res.displayName}` : ""}!`,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("API login error:", error);
      const errorMsg =
        error?.data?.message ||
        (error?.status === 401 ? t.wrongCredentials : null) ||
        (error?.status === 'FETCH_ERROR' ? t.network : null) ||
        t.loginFailed;
      notifyError(errorMsg);
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
        setResetLoading(true);

        const res = await forgotPasswordMutation({ email }).unwrap();

        showToast({
          status: "success",
          title: t.resetTitle,
          description: res?.message || t.resetSent,
        });
      } catch (error) {
        console.error("Password reset error:", error);
        const errorMsg = error?.data?.message || t.resetFailed;
        notifyError(errorMsg);
      } finally {
        setResetLoading(false);
      }
    };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4200} limit={1} />
      {(isSubmitting || oauthLoading) && <LoadingSpinner title="Signing in to NEXA" />}
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
              alt="NEXA login illustration"
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
                (validationErrors) => notifyError(
                  validationErrors.email?.message || validationErrors.password?.message || t.wrongCredentials,
                ),
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
                    aria-describedby={
                      errors.email
                        ? "login-email-error"
                        : undefined
                    }
                    {...register(
                      "email",
                    )}
                  />
                </div>

                {errors.email && (
                  <p
                    id="login-email-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-500"
                  >
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
                    aria-describedby={
                      errors.password
                        ? "login-password-error"
                        : undefined
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
                        ? t.hidePassword
                        : t.showPassword
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
                  <p
                    id="login-password-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-500"
                  >
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
                    showOauthLoginSuccess
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
                    showOauthLoginSuccess
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
