import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppStore';

export default function RequireRole({ allowedRoles = [] }) {
  const role = useAppSelector((state) => state.auth.role);
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/forbidden" replace />;
}
