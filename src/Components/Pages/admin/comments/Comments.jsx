import { useMemo, useState } from 'react'
import { Trash2, CheckCircle2 } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import SearchInput from '@/Components/Admin/common/SearchInput'
import Card from '@/Components/Admin/common/Card'
import AdminTable from '@/Components/Admin/common/AdminTable'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import { useComments } from '@/features/comments/useComments'

export default function Comments() {
  const { data, isLoading, isError, refetch } = useComments()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => (data || []).filter((c) => c.author.toLowerCase().includes(query.toLowerCase()) || c.post.toLowerCase().includes(query.toLowerCase())), [data, query])

  const columns = [
    { key: 'author', label: 'Author', sortable: true },
    { key: 'post', label: 'Post' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (c) => <Badge tone={statusTone(c.status)}>{c.status}</Badge> },
    { key: 'actions', label: '', render: () => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"><CheckCircle2 size={15} /></button>
        <button className="p-1.5 text-gray-400 hover:text-brand-secondary transition-colors"><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Comments" description="Review and moderate comments across all posts." />
      <Card className="p-4 mb-4"><SearchInput value={query} onChange={setQuery} placeholder="Search by author or post..." className="sm:max-w-xs" /></Card>
      <Card><AdminTable columns={columns} data={filtered} isLoading={isLoading} isError={isError} onRetry={refetch} emptyTitle="No comments found" /></Card>
    </div>
  )
}