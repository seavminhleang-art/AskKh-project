import React from "react";
import { useAuthInit } from "../../hooks/useAuthInit";

export default function AuthInitializer({ children }) {
  useAuthInit();
  return <>{children}</>;
}
