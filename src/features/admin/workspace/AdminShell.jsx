import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Users, FileText, MessageSquare, Tags, Search, ShieldAlert, Store, Bell, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Menu, X, ChevronRight } from 'lucide-react';
import { auth } from '@/Components/Firebase/firebase';
import { logout } from '@/features/auth/authSlice';
import { baseApi } from '@/store/api/baseApi';
import './admin.css';

export const navigation = [
  ['dashboard', 'Dashboard', LayoutDashboard], ['users', 'Users', Users], ['posts', 'Posts', FileText],
  ['comments', 'Comments', MessageSquare], ['tags', 'Tags', Tags], ['lost-found', 'Lost & Found', Search],
  ['moderation', 'Moderation', ShieldAlert], ['marketplace', 'Marketplace', Store], ['notifications', 'Notifications', Bell], ['settings', 'Settings', Settings],
];
export default function AdminShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [error, setError] = useState('');
  const [leaving, setLeaving] = useState(false);
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = navigation.find(([key]) => pathname.includes(`/admin/${key}`))?.[1] || 'Dashboard';
  const name = user?.displayName || user?.name || 'Admin';
  const initials = name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  async function exit() {
    setLeaving(true);
    try { await signOut(auth); dispatch(logout()); dispatch(baseApi.util.resetApiState()); navigate('/login', { replace: true }); }
    catch { setError('Unable to sign out. Please try again.'); }
    finally { setLeaving(false); }
  }
  return <div className={`admin-live ${collapsed ? 'is-collapsed' : ''}`}>
    {mobile && <button className="admin-scrim" aria-label="Close navigation" onClick={() => setMobile(false)} />}
    <aside className={`al-sidebar ${mobile ? 'is-open' : ''}`}>
      <div className="al-brand"><span className="al-logo">A</span><strong className="al-label">Ask-Kh Admin</strong><button className="al-collapse" aria-label="Toggle sidebar" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button><button className="al-mobile" aria-label="Close navigation" onClick={() => setMobile(false)}><X size={20}/></button></div>
      <nav aria-label="Admin navigation">{navigation.map(([key, label, Icon]) => <NavLink title={label} key={key} to={`/admin/${key}`} onClick={() => setMobile(false)} className={({isActive}) => isActive ? 'active' : ''}><Icon size={18}/><span className="al-label">{label}</span></NavLink>)}</nav>
      <div className="al-account"><span className="al-avatar">{initials}</span><div className="al-label"><strong>{name}</strong><small>{user?.email}</small></div><button disabled={leaving} onClick={exit} aria-label="Sign out"><LogOut size={18}/></button></div>
    </aside>
    <div className="al-workspace"><header className="al-topbar"><button className="al-mobile" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu size={22}/></button><div><small>Admin <ChevronRight size={12}/> {title}</small><strong>{title}</strong></div><div className="al-top-actions"><NavLink to="/admin/notifications" aria-label="Notifications"><Bell size={21}/></NavLink><NavLink className="al-avatar" to="/admin/settings" aria-label="Account settings">{initials}</NavLink></div></header><main className="al-main">{error && <p role="alert" className="al-alert">{error}</p>}<Outlet/></main></div>
  </div>;
}
