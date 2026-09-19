import { useState } from 'react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import StatCard from '@/Components/Admin/common/StatCard'
import { CardSkeleton } from '@/Components/Admin/common/Skeleton'
import Card from '@/Components/Admin/common/Card'
import Tabs from '@/Components/Admin/common/Tabs'
import AdminTable from '@/Components/Admin/common/AdminTable'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import { PackageSearch, CheckCircle2, Link2, ClipboardList } from 'lucide-react'
import { useLostFound } from '@/features/lostFound/useLostFound'

const icons = { total: PackageSearch, open: ClipboardList, claims: CheckCircle2, matches: Link2 }
const tabs = [
  { value: 'reports', label: 'Reports' },
  { value: 'claims', label: 'Claims' },
  { value: 'matches', label: 'Matches' },
  { value: 'locations', label: 'Locations' },
]

export default function LostFound() {
  const { data, isLoading, isError, refetch } = useLostFound()
  const [tab, setTab] = useState('reports')

  const reportColumns = [
    { key: 'item', label: 'Item', sortable: true },
    { key: 'reporter', label: 'Reporter' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ]

  const locationColumns = [
    { key: 'name', label: 'Location', sortable: true },
    { key: 'reports', label: 'Reports', sortable: true },
    { key: 'rooms', label: 'Rooms' },
    { key: 'floors', label: 'Floors' },
  ]

  const reportsByTab = {
    reports: data?.reports,
    claims: data?.reports.filter((r) => r.status === 'Claimed'),
    matches: data?.reports.filter((r) => r.status === 'Matched'),
  }

  return (
    <div>
      <PageHeader title="Lost & Found" description="Track lost item reports, claims, and matches across campus." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : data.stats.map((s) => <StatCard key={s.key} icon={icons[s.key]} title={s.title} value={s.value} />)}
      </div>

      <Card>
        <div className="px-4 pt-2"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
        <div className="p-1">
          {tab === 'locations' ? (
            <AdminTable columns={locationColumns} data={data?.locations || []} isLoading={isLoading} isError={isError} onRetry={refetch} emptyTitle="No locations found" />
          ) : (
            <AdminTable columns={reportColumns} data={reportsByTab[tab] || []} isLoading={isLoading} isError={isError} onRetry={refetch} emptyTitle="No records found" />
          )}
        </div>
      </Card>
    </div>
  )
}
