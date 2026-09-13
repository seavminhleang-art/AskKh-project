import Card from '@/Components/Admin/common/Card'
import Button from '@/Components/Admin/common/Button'

export default function PlatformPanel() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Institute & Campus Profile</h3>
      <p className="text-sm text-gray-500 mb-5">Basic information shown across the platform.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Platform Name</label>
          <input defaultValue="Ask-Kh / ISTAD Forum" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Support Email</label>
          <input defaultValue="support@askkh.io" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
        </div>
      </div>
      <Button className="mt-5" size="sm">Save changes</Button>
    </Card>
  )
}
