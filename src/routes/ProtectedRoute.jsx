import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((s) => Boolean(s.auth.accessToken))
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
