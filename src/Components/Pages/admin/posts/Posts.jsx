import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import SearchInput from '@/Components/Admin/common/SearchInput'
import Card from '@/Components/Admin/common/Card'
import AdminTable from '@/Components/Admin/common/AdminTable'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import { usePosts } from '@/features/posts/usePosts'

export default function Posts() {
  const { data, isLoading, isError, refetch } = usePosts()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => (data || []).filter((p) => p.title.toLowerCase().includes(query.toLowerCase())), [data, query])

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (p) => <span className="font-medium text-gray-800">{p.title}</span> },
    { key: 'author', label: 'Author' },
    { key: 'tags', label: 'Tags', render: (p) => (
      <div className="flex gap-1 flex-wrap">{p.tags.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}</div>
    ) },
    { key: 'type', label: 'Type' },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'comments', label: 'Comments' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (p) => <Badge tone={statusTone(p.status)}>{p.status}</Badge> },
    { key: 'actions', label: '', render: (p) => (
      <div className="flex items-center gap-1">
        <button onClick={() => navigate(`/admin/posts/${p.id}`)} className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors"><Eye size={15} /></button>
        <button className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors"><Pencil size={15} /></button>
        <button className="p-1.5 text-gray-400 hover:text-brand-secondary transition-colors"><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Posts" description="Browse, moderate, and manage forum posts." />
      <Card className="p-4 mb-4"><SearchInput value={query} onChange={setQuery} placeholder="Search posts..." className="sm:max-w-xs" /></Card>
      <Card>
        <AdminTable columns={columns} data={filtered} isLoading={isLoading} isError={isError} onRetry={refetch} emptyTitle="No posts found" />
      </Card>
    </div>
  )
}