import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, Award } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import Card from '@/Components/Admin/common/Card'
import Avatar from '@/Components/Admin/common/Avatar'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import Button from '@/Components/Admin/common/Button'
import { useUsers } from '@/features/users/useUsers'
import { mockUserActivity } from '@/mocks/usersMock'

export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: users, isLoading } = useUsers()
  const user = users?.find((u) => u.id === id)
  const activity = mockUserActivity(id)

  if (isLoading) return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
  if (!user) return <p className="text-sm text-gray-500">User not found.</p>

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowLeft size={15} /> Back to Users
      </button>
      <PageHeader title="User Profile" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-1 text-center">
          <Avatar src={user.avatar} name={user.name} size={72} />
          <h2 className="mt-3 font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-0.5"><Mail size={13} /> {user.email}</p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge tone={statusTone(user.status)}>{user.status}</Badge>
            <Badge tone="primary">{user.role}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5 text-left">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400 flex items-center gap-1"><Award size={12} /> Reputation</p>
              <p className="font-semibold text-gray-800">{user.reputation.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> Joined</p>
              <p className="font-semibold text-gray-800">{user.joined}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
            <Button variant="danger" size="sm" className="flex-1">Suspend</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Posts</h3>
            <div className="divide-y divide-gray-50">
              {activity.posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <p className="text-sm text-gray-700">{p.title}</p>
                  <span className="text-xs text-gray-400">{p.date}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Comments</h3>
            <div className="divide-y divide-gray-50">
              {activity.comments.map((c) => (
                <div key={c.id} className="py-2.5">
                  <p className="text-sm text-gray-700">{c.body}</p>
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
