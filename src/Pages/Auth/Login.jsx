import { Navigate } from 'react-router-dom';

// Legacy entry point uses the real API-backed login.
export default function Login() {
  return <Navigate to="/login" replace />;
}
