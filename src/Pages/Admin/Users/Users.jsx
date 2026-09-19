import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Download } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import SearchInput from '@/Components/Admin/common/SearchInput'
import Button from '@/Components/Admin/common/Button'
import Card from '@/Components/Admin/common/Card'
import AdminTable from '@/Components/Admin/common/AdminTable'
import Avatar from '@/Components/Admin/common/Avatar'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import ConfirmDialog from '@/Components/Admin/common/ConfirmDialog'
import { useUsers } from '@/features/users/useUsers'
import { useToast } from '@/Components/Admin/common/ToastProvider'

const ROLES = ['All', 'Student', 'Moderator', 'Instructor', 'Admin']

export default function Users() {
  const { data, isLoading, isError, refetch } = useUsers()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All')
  const [toDelete, setToDelete] = useState(null)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((u) => {
      const matchesQuery = `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())
      const matchesRole = role === 'All' || u.role === role
      return matchesQuery && matchesRole
    })
  }, [data, query, role])

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (u) => (
      <div className="flex items-center gap-2.5">
        <Avatar src={u.avatar} name={u.name} size={30} />
        <span className="font-medium text-gray-800">{u.name}</span>
      </div>
    ) },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', render: (u) => <Badge tone={statusTone(u.status)}>{u.status}</Badge> },
    { key: 'reputation', label: 'Activity', sortable: true, render: (u) => `${u.reputation.toLocaleString()} rep`  },
    { key: 'joined', label: 'Created', sortable: true },
    { key: 'actions', label: '', render: (u) => (
      <div className="flex items-center gap-1">
        <button onClick={() => navigate(`/admin/users/${u.id}`)} className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors" aria-label="View"><Eye size={15} /></button>
        <button onClick={() => showToast(`Editing ${u.name} is not implemented yet.`, 'info')} className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors" aria-label="Edit"><Pencil size={15} /></button>
        <button onClick={() => setToDelete(u)} className="p-1.5 text-gray-400 hover:text-brand-secondary transition-colors" aria-label="Delete"><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage student, moderator, and admin accounts."
        actions={<Button variant="secondary" icon={Download} size="sm">Export</Button>}
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email..." className="sm:max-w-xs" />
          <div className="flex gap-1.5 flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${role === r ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <AdminTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
      </Card>

      {toDelete && (
        <ConfirmDialog
          open
          onClose={() => setToDelete(null)}
          onConfirm={() => showToast(`${toDelete.name} was deleted.`, 'success')}
          title="Delete user"
          description={`This will permanently remove ${toDelete.name}'s account. This action cannot be undone.`}
          confirmLabel="Delete"
        />
      )}
    </div>
  )
}
