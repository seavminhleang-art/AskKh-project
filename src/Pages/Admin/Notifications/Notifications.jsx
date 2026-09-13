import { useState } from 'react'
import { Bell, ShieldAlert, UserPlus, PackageSearch, Info } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import Card from '@/Components/Admin/common/Card'
import Button from '@/Components/Admin/common/Button'
import EmptyState from '@/Components/Admin/common/EmptyState'
import ErrorState from '@/Components/Admin/common/ErrorState'
import { Skeleton } from '@/Components/Admin/common/Skeleton'
import { useNotifications } from '@/features/notifications/useNotifications'

const typeIcon = { moderation: ShieldAlert, user: UserPlus, 'lost-found': PackageSearch, system: Info }

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diffMs / 3600000)
  if (hrs < 1) return 'Just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const { data, isLoading, isError, refetch } = useNotifications()
  const [readState, setReadState] = useState({})

  const isRead = (n) => readState[n.id] ?? n.read
  const markAllRead = () => {
    const next = {}
    ;(data || []).forEach((n) => { next[n.id] = true })
    setReadState(next)
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of moderation, user, and system events."
        actions={<Button variant="secondary" size="sm" onClick={markAllRead}>Mark all as read</Button>}
      />
      <Card>
        {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : !data.length ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        ) : (
          <div className="divide-y divide-gray-50">
            {data.map((n) => {
              const Icon = typeIcon[n.type] || Info
              const read = isRead(n)
              return (
                <div
                  key={n.id}
                  onClick={() => setReadState((s) => ({ ...s, [n.id]: true }))}
                  className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-gray-50 ${!read ? 'bg-brand-primary-light/30' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.user} · {timeAgo(n.time)}</p>
                  </div>
                  {!read && <span className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
