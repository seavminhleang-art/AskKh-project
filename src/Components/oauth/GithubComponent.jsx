import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  githubProvider,
} from "../Firebase/firebase.js";

export default function GithubComponent({
  label = "GitHub",
  loadingLabel = "...",
  onSuccess,
  onError,
  disabled = false,
}) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleGithubAuth =
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
            githubProvider,
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
        handleGithubAuth
      }
      disabled={
        loading ||
        disabled
      }
    >
      <Icon
        icon="mdi:github"
        width="25"
      />

      <span>
        {loading
          ? loadingLabel
          : label}
      </span>
    </button>
  );
}