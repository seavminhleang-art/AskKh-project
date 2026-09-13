import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard, Users, FileText, MessageSquare, Tags, Search,
  ShieldAlert, Store, Bell, Settings, LogOut, PanelLeftClose, PanelLeftOpen, X,
} from 'lucide-react'
import Avatar from '../common/Avatar'
import { toggleSidebar, setSidebarMobileOpen } from '@/redux/slices/uiSlice'
import { logout } from '@/redux/slices/authSlice'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { to: '/admin/tags', label: 'Tags', icon: Tags },
  { to: '/admin/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/admin/moderation', label: 'Moderation', icon: ShieldAlert },
  { to: '/admin/marketplace', label: 'Marketplace', icon: Store },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const collapsed = useSelector((s) => s.ui.sidebarCollapsed)
  const mobileOpen = useSelector((s) => s.ui.sidebarMobileOpen)
  const admin = useSelector((s) => s.auth.admin) || { name: 'Admin User', email: 'admin@askkh.io' }

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 h-16 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            A
          </div>
          {!collapsed && <span className="font-semibold text-gray-900 whitespace-nowrap">Ask-Kh Admin</span>}
        </div>
        <button
          className="hidden lg:flex text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <button
          className="lg:hidden text-gray-400 hover:text-gray-600"
          onClick={() => dispatch(setSidebarMobileOpen(false))}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => dispatch(setSidebarMobileOpen(false))}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-brand-primary-light text-brand-primary' : 'text-gray-500 hover:bg-gray-100'}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar name={admin.name} size={32} />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{admin.name}</p>
              <p className="text-xs text-gray-400 truncate">{admin.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => dispatch(logout())} className="text-gray-400 hover:text-brand-secondary transition-colors" aria-label="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={`hidden lg:block flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0
          transition-[width] duration-200 ${collapsed ? 'w-[76px]' : 'w-64'}`}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => dispatch(setSidebarMobileOpen(false))} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white animate-fade-slide">{content}</aside>
        </div>
      )}
    </>
  )
}
