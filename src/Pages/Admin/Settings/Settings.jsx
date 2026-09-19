import { useState } from 'react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import Card from '@/Components/Admin/common/Card'
import {
  Building2, Palette, Wrench, HelpCircle, ShieldCheck, History as HistoryIcon, Bell,
} from 'lucide-react'
import PlatformPanel from './panels/PlatformPanel'
import AppearancePanel from './panels/AppearancePanel'
import GenericPanel from './panels/GenericPanel'

const sections = [
  { key: 'platform', label: 'Platform', icon: Building2 },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'qa', label: 'Q & A', icon: HelpCircle },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'history', label: 'History', icon: HistoryIcon },
  { key: 'notifications', label: 'Notifications', icon: Bell },
]

const genericContent = {
  maintenance: { title: 'Maintenance Mode', description: 'Control scheduled downtime and banner messages.', fields: [
    { label: 'Maintenance mode', status: 'Off' }, { label: 'Scheduled downtime banner', status: 'Off' },
  ] },
  qa: { title: 'Q&A Rules & Moderation', description: 'AI content moderation and answer quality settings for Q&A.', fields: [
    { label: 'AI content moderation engine', status: 'Enabled' }, { label: 'Require tags on new questions', status: 'Enabled' },
  ] },
  security: { title: 'Security', description: 'Admin access controls and audit protections.', fields: [
    { label: 'Two-factor authentication', status: 'Enabled' }, { label: 'Session timeout', hint: 'Auto sign-out after inactivity', status: '30 min' },
  ] },
  history: { title: 'Activity History', description: 'Audit log of administrative changes.', fields: [
    { label: 'Retain audit logs', status: '90 days' }, { label: 'Export activity log', status: 'Available' },
  ] },
  notifications: { title: 'Notification & Security Alert Channels', description: 'Where administrative alerts are delivered.', fields: [
    { label: 'Telegram bot for admin', status: 'Connected' }, { label: 'Email alerts', status: 'Enabled' },
  ] },
}

export default function Settings() {
  const [active, setActive] = useState('platform')

  return (
    <div>
      <PageHeader title="Platform Settings" description="Configure platform-wide behavior and preferences." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 p-2 h-fit">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active === key ? 'bg-brand-primary-light text-brand-primary' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </Card>

        <div className="lg:col-span-3 animate-fade-in">
          {active === 'platform' && <PlatformPanel />}
          {active === 'appearance' && <AppearancePanel />}
          {genericContent[active] && <GenericPanel {...genericContent[active]} />}
        </div>
      </div>
    </div>
  )
}
