import { useState } from "react";
import ConfirmDialog from "@/Components/common/ConfirmDialog";

export default function useLogoutPrompt(onConfirm, isLoading = false) {
  const [isOpen, setIsOpen] = useState(false);

  return {
    requestLogout: () => setIsOpen(true),
    dialog: (
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={async () => {
          await onConfirm();
          setIsOpen(false);
        }}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmText="Log out"
        cancelText="Stay signed in"
        isLoading={isLoading}
      />
    ),
  };
}
