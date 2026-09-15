import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppStore';
import LoadingState from '@/Components/common/LoadingState';

export default function RequireAuth() {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) return <LoadingState type="detail" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
