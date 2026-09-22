import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthInit } from "../hooks/useAuthInit";

export default function ProtectedRoute({ requiredRole }) {
  const initialized = useAuthInit();
  const { accessToken, role } = useSelector(state => state.auth);
  if (!initialized) return <p role="status" className="p-8 text-center">Restoring your session…</p>;
  if (!accessToken) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
