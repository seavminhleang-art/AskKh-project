import PageHeader from '@/Components/Admin/common/PageHeader'
import StatCard from '@/Components/Admin/common/StatCard'
import { CardSkeleton } from '@/Components/Admin/common/Skeleton'
import Card from '@/Components/Admin/common/Card'
import AdminTable from '@/Components/Admin/common/AdminTable'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import Button from '@/Components/Admin/common/Button'
import { ClipboardList, Flag, CheckCircle2 } from 'lucide-react'
import { useModeration } from '@/features/moderation/useModeration'
import { useToast } from '@/Components/Admin/common/ToastProvider'

const icons = { pending: ClipboardList, flagged: Flag, resolutionRate: CheckCircle2 }
const severityTone = { High: 'danger', Medium: 'warning', Low: 'neutral' }

export default function Moderation() {
  const { data, isLoading, isError, refetch } = useModeration()
  const { showToast } = useToast()

  const columns = [
    { key: 'content', label: 'Reported Content', render: (m) => <span className="font-medium text-gray-800">{m.content}</span> },
    { key: 'author', label: 'User' },
    { key: 'reason', label: 'Reason' },
    { key: 'severity', label: 'Severity', render: (m) => <Badge tone={severityTone[m.severity]}>{m.severity}</Badge> },
    { key: 'status', label: 'Status', render: (m) => <Badge tone={statusTone(m.status)}>{m.status}</Badge> },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'actions', label: '', render: (m) => (
      <div className="flex items-center gap-1.5">
        <Button size="sm" variant="secondary" onClick={() => showToast(`Reviewing report on "${m.content}"`, 'info')}>Review</Button>
        <Button size="sm" variant="primary" onClick={() => showToast('Content approved.', 'success')}>Approve</Button>
        <Button size="sm" variant="danger" onClick={() => showToast('Content rejected.', 'error')}>Reject</Button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Moderation & Safety" description="Review flagged content and keep the community safe." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : data.stats.map((s) => <StatCard key={s.key} icon={icons[s.key]} title={s.title} value={s.value} />)}
      </div>
      <Card>
        <AdminTable columns={columns} data={data?.queue || []} isLoading={isLoading} isError={isError} onRetry={refetch} pageSize={8} emptyTitle="Queue is clear" emptyDescription="No content is currently pending review." />
      </Card>
    </div>
  )
}