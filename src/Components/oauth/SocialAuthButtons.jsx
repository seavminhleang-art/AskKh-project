import { toast } from "react-toastify";
import GoogleComponent from "./GoogleComponent.jsx";
import GithubComponent from "./GithubComponent.jsx";

export default function SocialAuthButtons({ t, isKhmer, disabled }) {
  const handleSuccess = () => {
    toast.info(
      isKhmer
        ? "បានភ្ជាប់គណនីជាមួយ Firebase។ ការចូល AskKH តាម Google/GitHub មិនទាន់រួចរាល់ទេ។ សូមប្រើអ៊ីមែល និងពាក្យសម្ងាត់។"
        : "Your account is connected to Firebase. Google/GitHub login to AskKH is not ready yet. Please use email and password to sign in.",
      { toastId: "social-auth-status", autoClose: 8000 },
    );
  };

  const handleError = (error, provider) => {
    const messages = {
      "auth/popup-blocked": t.popupBlocked,
      "auth/account-exists-with-different-credential": t.accountExists,
      "auth/network-request-failed": t.network,
      "auth/too-many-requests": t.tooMany,
      "auth/unauthorized-domain": isKhmer
        ? "Domain នេះមិនទាន់បានអនុញ្ញាតក្នុង Firebase Authentication។ សូមទាក់ទងអ្នកគ្រប់គ្រង។"
        : "This website domain is not authorized in Firebase Authentication. Add it to the project's authorized domains.",
      "auth/invalid-api-key": isKhmer
        ? "ការកំណត់ Firebase មិនត្រឹមត្រូវ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។"
        : "The Firebase API key is invalid. Check the website's Firebase configuration.",
    };
    const message = error.code === "auth/operation-not-allowed"
      ? (isKhmer
        ? `ការចូលតាម ${provider} មិនទាន់បានបើកក្នុង Firebase។`
        : `${provider} authentication is not enabled in Firebase.`)
      : messages[error.code] || (provider === "Google" ? t.googleFailed : t.githubFailed);
    toast.error(message, { toastId: "social-auth-error" });
  };

  return (
    <>
      <div className="auth-divider">
        <span />
        <p>{t.continueWith}</p>
        <span />
      </div>
      <div className="social-buttons">
        <GoogleComponent
          label={t.google}
          disabled={disabled}
          onSuccess={handleSuccess}
          onError={(error) => handleError(error, "Google")}
        />
        <GithubComponent
          label={t.github}
          disabled={disabled}
          onSuccess={handleSuccess}
          onError={(error) => handleError(error, "GitHub")}
        />
      </div>
    </>
  );
}
