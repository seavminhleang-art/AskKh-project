import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import SearchInput from '@/Components/Admin/common/SearchInput'
import Button from '@/Components/Admin/common/Button'
import Card from '@/Components/Admin/common/Card'
import AdminTable from '@/Components/Admin/common/AdminTable'
import { useTags } from '@/features/tags/useTags'

export default function Tags() {
  const { data, isLoading, isError, refetch } = useTags()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => (data || []).filter((t) => t.name.toLowerCase().includes(query.toLowerCase())), [data, query])
  const popular = useMemo(() => [...(data || [])].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4), [data])

  const columns = [
    { key: 'name', label: 'Tag', sortable: true, render: (t) => <span className="font-medium text-brand-primary">#{t.name}</span> },
    { key: 'description', label: 'Description' },
    { key: 'usageCount', label: 'Usage', sortable: true },
    { key: 'actions', label: '', render: () => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors"><Pencil size={15} /></button>
        <button className="p-1.5 text-gray-400 hover:text-brand-secondary transition-colors"><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Tags" description="Organize and curate content tags." actions={<Button icon={Plus} size="sm">New Tag</Button>} />

      {!isLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">Popular tags</p>
          <div className="flex gap-2 flex-wrap">
            {popular.map((t) => (
              <span key={t.id} className="px-3 py-1.5 bg-brand-primary-light text-brand-primary rounded-full text-sm font-medium">
                #{t.name} · {t.usageCount}
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 mb-4"><SearchInput value={query} onChange={setQuery} placeholder="Search tags..." className="sm:max-w-xs" /></Card>
      <Card><AdminTable columns={columns} data={filtered} isLoading={isLoading} isError={isError} onRetry={refetch} emptyTitle="No tags found" /></Card>
    </div>
  )
}