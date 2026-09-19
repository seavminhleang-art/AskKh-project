import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ requiredRole }) {
  const isAuthenticated = useSelector((s) => Boolean(s.auth.accessToken))
  const role = useSelector((s) => s.auth.role)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
