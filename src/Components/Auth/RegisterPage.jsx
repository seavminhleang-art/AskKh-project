import {
  useMemo,
  useState,
} from "react";

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

    firstTooShort:
      "នាមខ្លួនត្រូវមានយ៉ាងហោចណាស់ ២ តួអក្សរ។",

    firstTooLong:
      "នាមខ្លួនមិនអាចលើសពី ៥០ តួអក្សរ។",

    lastRequired:
      "សូមបញ្ចូលនាមត្រកូល។",

    lastTooShort:
      "នាមត្រកូលត្រូវមានយ៉ាងហោចណាស់ ២ តួអក្សរ។",

    lastTooLong:
      "នាមត្រកូលមិនអាចលើសពី ៥០ តួអក្សរ។",

    emailRequired:
      "សូមបញ្ចូលអ៊ីមែល។",

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

    passwordRequired:
      "សូមបញ្ចូលពាក្យសម្ងាត់។",

    passwordLength:
      "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ។",

    passwordUppercase:
      "ពាក្យសម្ងាត់ត្រូវមានអក្សរធំយ៉ាងហោចណាស់ ១។",

    passwordLowercase:
      "ពាក្យសម្ងាត់ត្រូវមានអក្សរតូចយ៉ាងហោចណាស់ ១។",

    passwordNumber:
      "ពាក្យសម្ងាត់ត្រូវមានលេខយ៉ាងហោចណាស់ ១។",

    confirmRequired:
      "សូមបញ្ជាក់ពាក្យសម្ងាត់។",

    passwordMismatch:
      "ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នា។",

    termsRequired:
      "សូមយល់ព្រមនឹងលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព។",

    accountCreated:
      "បង្កើតគណនីបានជោគជ័យ។ ឥឡូវនេះអ្នកអាចចូលគណនីបាន។",

    emailExists:
      "អ៊ីមែលនេះបានចុះឈ្មោះរួចហើយ។",

    registerFailed:
      "ការចុះឈ្មោះបរាជ័យ។",

    network:
      "មានបញ្ហាបណ្តាញ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។",

    tooMany:
      "ការព្យាយាមច្រើនពេក។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។",

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

    firstTooShort:
      "Firstname must contain at least 2 characters.",

    firstTooLong:
      "Firstname cannot exceed 50 characters.",

    lastRequired:
      "Please enter your lastname.",

    lastTooShort:
      "Lastname must contain at least 2 characters.",

    lastTooLong:
      "Lastname cannot exceed 50 characters.",

    emailRequired:
      "Please enter your email.",

    invalidEmail:
      "Please enter a valid email address.",

    emailMissingAt:
      "Email must include @",

    gmailSuggestion:
      "Did you mean @gmail.com?",

    invalidEmailFormat:
      "Invalid email format (e.g. name@example.com)",

    emailDomainExtension:
      "Email domain must include an extension like .com (e.g. gmail.com)",

    passwordRequired:
      "Please enter your password.",

    passwordLength:
      "Password must contain at least 8 characters.",

    passwordUppercase:
      "Password must contain at least 1 uppercase letter.",

    passwordLowercase:
      "Password must contain at least 1 lowercase letter.",

    passwordNumber:
      "Password must contain at least 1 number.",

    confirmRequired:
      "Please confirm your password.",

    passwordMismatch:
      "Password and confirm password do not match.",

    termsRequired:
      "Please agree to the Terms of Service and Privacy Policy.",

    accountCreated:
      "Account created successfully. You can now log in.",

    emailExists:
      "This email is already registered.",

    registerFailed:
      "Registration failed. Please try again.",

    network:
      "Network error. Please check your internet connection.",

    tooMany:
      "Too many attempts. Please try again later.",

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

const createEmailSchema = (
  t,
) =>
  z
    .string()
    .trim()
    .min(
      1,
      t.emailRequired,
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

const createRegisterSchema = (
  t,
) =>
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(
          1,
          t.firstRequired,
        )
        .min(
          2,
          t.firstTooShort,
        )
        .max(
          50,
          t.firstTooLong,
        ),

      lastName: z
        .string()
        .trim()
        .min(
          1,
          t.lastRequired,
        )
        .min(
          2,
          t.lastTooShort,
        )
        .max(
          50,
          t.lastTooLong,
        ),

      email:
        createEmailSchema(
          t,
        ),

      password: z
        .string()
        .min(
          1,
          t.passwordRequired,
        )
        .min(
          8,
          t.passwordLength,
        )
        .regex(
          /[A-Z]/,
          t.passwordUppercase,
        )
        .regex(
          /[a-z]/,
          t.passwordLowercase,
        )
        .regex(
          /[0-9]/,
          t.passwordNumber,
        ),

      confirmPassword:
        z
          .string()
          .min(
            1,
            t.confirmRequired,
          ),

      agreeToTerms:
        z
          .boolean()
          .refine(
            (
              value,
            ) =>
              value ===
              true,
            {
              message:
                t.termsRequired,
            },
          ),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          t.passwordMismatch,

        path: [
          "confirmPassword",
        ],
      },
    );

export default function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    language,
    isKhmer,
  } = useLanguage();

  const t =
    translations[
      language
    ];

  const registerSchema =
    useMemo(
      () =>
        createRegisterSchema(
          t,
        ),
      [t],
    );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(
        registerSchema,
      ),

    mode: "onBlur",

    reValidateMode:
      "onChange",

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
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
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const notifyError = (
    description,
  ) => {
    showToast({
      status:
        "error",

      title:
        t.errorTitle,

      description,
    });
  };

  const onSubmit =
    async (data) => {
      try {
        const result =
          await createUserWithEmailAndPassword(
            auth,
            data.email
              .trim()
              .toLowerCase(),
            data.password,
          );

        await updateProfile(
          result.user,
          {
            displayName:
              `${data.firstName.trim()} ${data.lastName.trim()}`,
          },
        );

        await signOut(
          auth,
        );

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

        switch (
          error.code
        ) {
          case "auth/email-already-in-use":
            notifyError(
              t.emailExists,
            );
            break;

          case "auth/invalid-email":
            notifyError(
              t.invalidEmail,
            );
            break;

          case "auth/network-request-failed":
            notifyError(
              t.network,
            );
            break;

          case "auth/too-many-requests":
            notifyError(
              t.tooMany,
            );
            break;

          default:
            notifyError(
              t.registerFailed,
            );
        }
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
                {
                  t.title
                }
              </h1>

              <p>
                {
                  t.alreadyAccount
                }

                <Link to="/login">
                  {
                    t.login
                  }
                </Link>
              </p>
            </div>

            <form
              className="auth-form register-form"
              onSubmit={handleSubmit(
                onSubmit,
              )}
              noValidate
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

                  <div
                    className={`input-wrapper no-icon ${
                      errors.firstName
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <input
                      id="register-first-name"
                      type="text"
                      autoComplete="given-name"
                      placeholder={
                        t.firstnamePlaceholder
                      }
                      aria-invalid={
                        errors.firstName
                          ? "true"
                          : "false"
                      }
                      {...register(
                        "firstName",
                      )}
                    />
                  </div>

                  {errors.firstName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {
                        errors
                          .firstName
                          .message
                      }
                    </p>
                  )}
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

                  <div
                    className={`input-wrapper no-icon ${
                      errors.lastName
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <input
                      id="register-last-name"
                      type="text"
                      autoComplete="family-name"
                      placeholder={
                        t.lastnamePlaceholder
                      }
                      aria-invalid={
                        errors.lastName
                          ? "true"
                          : "false"
                      }
                      {...register(
                        "lastName",
                      )}
                    />
                  </div>

                  {errors.lastName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {
                        errors
                          .lastName
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email">
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
                    id="register-email"
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
                <label htmlFor="register-password">
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
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
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

              <div className="form-group">
                <label htmlFor="register-confirm-password">
                  {
                    t.confirmPassword
                  }

                  <span>
                    *
                  </span>
                </label>

                <div
                  className={`input-wrapper ${
                    errors.confirmPassword
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
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder={
                      t.confirmPlaceholder
                    }
                    aria-invalid={
                      errors.confirmPassword
                        ? "true"
                        : "false"
                    }
                    {...register(
                      "confirmPassword",
                    )}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
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

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      errors
                        .confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="checkbox-label terms-checkbox">
                  <input
                    type="checkbox"
                    {...register(
                      "agreeToTerms",
                    )}
                  />

                  <span className="custom-checkbox" />

                  <span className="checkbox-text">
                    {
                      t.agree
                    }{" "}

                    <Link to="/terms">
                      {
                        t.terms
                      }
                    </Link>{" "}

                    {
                      t.and
                    }{" "}

                    <Link to="/privacy">
                      {
                        t.privacy
                      }
                    </Link>
                  </span>
                </label>

                {errors.agreeToTerms && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      errors
                        .agreeToTerms
                        .message
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="primary-auth-button"
                disabled={
                  isSubmitting
                }
              >
                {isSubmitting
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