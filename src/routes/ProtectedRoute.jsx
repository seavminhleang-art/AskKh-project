import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { isAuthenticated, isInitialized, user } = useSelector((s) => ({
    isAuthenticated: Boolean(s.auth.accessToken || s.auth.user),
    isInitialized: s.auth.isInitialized,
    user: s.auth.user,
  }));

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

