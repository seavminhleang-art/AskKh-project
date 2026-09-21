import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../Components/Firebase/firebase";
import { setCredentials } from "../features/auth/authSlice";
import { useAuthInit } from "../hooks/useAuthInit";

export default function ProtectedRoute({ requiredRole }) {
  const dispatch = useDispatch();
  const initialized = useAuthInit();
  const [firebaseReady, setFirebaseReady] = useState(false);
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth.accessToken),
  );
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        await auth.authStateReady();
        const user = auth.currentUser;
        if (user) {
          const result = await user.getIdTokenResult();
          if (active)
            dispatch(
              setCredentials({
                accessToken: result.token,
                user: {
                  id: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  avatar: user.photoURL,
                  role: result.claims.admin === true ? "admin" : "student",
                },
              }),
            );
        }
      } catch {
        // A failed session restoration falls through to the sign-in screen.
      } finally {
        if (active) setFirebaseReady(true);
      }
    }
    restoreSession();
    return () => {
      active = false;
    };
  }, [dispatch]);
  if (!initialized || !firebaseReady)
    return (
      <p role="status" className="p-8 text-center">
        Restoring your session…
      </p>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole)
    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
