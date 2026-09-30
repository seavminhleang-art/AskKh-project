import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../Firebase/firebase.js";

export default function GoogleComponent({
  label = "Google",
  loadingLabel = "...",
  onSuccess,
  onError,
  disabled = false,
}) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleGoogleAuth =
    async () => {
      if (
        loading ||
        disabled
      ) {
        return;
      }

      try {
        setLoading(true);

        const result =
          await signInWithPopup(
            auth,
            googleProvider,
          );

        onSuccess?.(
          result.user,
          result,
        );
      } catch (error) {
        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {
          return;
        }

        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      type="button"
      className="social-button"
      onClick={
        handleGoogleAuth
      }
      disabled={
        loading ||
        disabled
      }
    >
      <Icon
        icon="flat-color-icons:google"
        width="24"
      />

      <span>
        {loading
          ? loadingLabel
          : label}
      </span>
    </button>
  );
}