import Card from '@/Components/Admin/common/Card'
import Button from '@/Components/Admin/common/Button'

// Shared shell for the remaining settings sections (Maintenance, Q&A,
// Security, History, Notifications). Each keeps the same two-column
// pattern; wire real fields in as their requirements firm up.
export default function GenericPanel({ title, description, fields = [] }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">{f.label}</p>
              {f.hint && <p className="text-xs text-gray-400 mt-0.5">{f.hint}</p>}
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{f.status || 'Configured'}</span>
          </div>
        ))}
      </div>
      <Button className="mt-5" size="sm">Save changes</Button>
    </Card>
  )
}
