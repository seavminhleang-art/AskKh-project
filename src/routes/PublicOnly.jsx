import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppStore';
import LoadingState from '@/Components/common/LoadingState';

export default function PublicOnly() {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  if (!isInitialized) return <LoadingState type="detail" />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
