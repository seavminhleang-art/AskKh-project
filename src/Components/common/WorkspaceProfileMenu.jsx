import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, UserRound, Settings } from 'lucide-react';
import { useWorkspaceTranslation } from '@/locales/workspace/useWorkspaceTranslation';

export default function WorkspaceProfileMenu({ user, mode = 'user' }) {
  const { w } = useWorkspaceTranslation();
  const ref = useRef(null);
  const { pathname } = useLocation();
  const name = user?.displayName || user?.name || w('My profile');
  const photo = user?.profileImage || user?.avatar || user?.photoURL;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('').toUpperCase();
  useEffect(() => { if (ref.current) ref.current.open = false; }, [pathname]);
  useEffect(() => {
    const outside = event => { if (ref.current && !ref.current.contains(event.target)) ref.current.open = false; };
    const escape = event => { if (event.key === 'Escape' && ref.current?.open) { ref.current.open = false; ref.current.querySelector('summary')?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  return <details className="workspace-profile" ref={ref}>
    <summary aria-label={w('My profile')}>
      <span className="workspace-profile-avatar">{photo ? <img src={photo} alt="" /> : initials}</span>
      <span className="workspace-profile-name">{name}</span><ChevronDown size={14} aria-hidden="true" />
    </summary>
    <div className="workspace-profile-panel">
      <div className="workspace-profile-info"><strong>{name}</strong>{user?.email && <span>{user.email}</span>}</div>
      <Link to={mode === 'admin' ? '/admin/settings' : '/dashboard/profile'} onClick={() => { ref.current.open = false; }}><UserRound size={17} />{w('Profile')}</Link>
      <Link to={mode === 'admin' ? '/admin/settings' : '/dashboard/settings'} onClick={() => { ref.current.open = false; }}><Settings size={17} />{w('Settings')}</Link>
    </div>
  </details>;
}
