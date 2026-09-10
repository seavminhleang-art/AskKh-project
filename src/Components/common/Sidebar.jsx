import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Bookmark,
  Sparkles,
  Award,
  Bell,
  User,
  Shield,
  Users,
  HelpCircle,
  Flag,
  Search,
  CheckCircle2,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { logout } from '../../store/slices/authSlice';
import { ROLES } from '../../constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Sidebar({ mode = 'user' }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const navItems = mode === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/dashboard');
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
      <div className="space-y-6">
        {/* User / Admin Mini Profile Badge */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase',
                    mode === 'admin'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  )}
                >
                  {role}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {user.points || 0} pts
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section Label */}
        <div>
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {mode === 'admin' ? 'Campus Administration' : 'Member Workspace'}
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/dashboard' || item.path === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all select-none',
                      isActive
                        ? mode === 'admin'
                          ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
