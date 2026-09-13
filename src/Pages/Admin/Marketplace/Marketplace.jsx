import { useMemo, useState } from 'react'
import { MapPin, Store } from 'lucide-react'
import PageHeader from '@/Components/Admin/common/PageHeader'
import SearchInput from '@/Components/Admin/common/SearchInput'
import Card from '@/Components/Admin/common/Card'
import Badge, { statusTone } from '@/Components/Admin/common/Badge'
import EmptyState from '@/Components/Admin/common/EmptyState'
import ErrorState from '@/Components/Admin/common/ErrorState'
import { Skeleton } from '@/Components/Admin/common/Skeleton'
import { useMarketplace } from '@/features/marketplace/useMarketplace'
import { USE_MOCK_API } from '@/utils/mockMode'

const CATEGORIES = ['All', 'Electronics', 'Books & Supplies', 'Fashion']

export default function Marketplace() {
  const { data, isLoading, isError, refetch } = useMarketplace()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => (data || []).filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || item.category === category)
  ), [data, query, category])

  // Per project policy: the real API has no marketplace endpoints yet.
  // Real-API mode must say so plainly instead of silently reusing mocks.
  if (!USE_MOCK_API) {
    return (
      <div>
        <PageHeader title="Marketplace" description="Buy and sell listings across campus." />
        <Card className="p-10">
          <EmptyState icon={Store} title="Marketplace API not available" description="No marketplace endpoints exist in the current API specification yet." />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Marketplace" description="Buy and sell listings across campus." />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search listings..." className="sm:max-w-xs" />
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10"><EmptyState title="No listings found" description="Try a different search or category." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden animate-fade-slide">
              <img src={item.image} alt={item.name} className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-800 text-sm leading-snug">{item.name}</p>
                  <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                </div>
                <p className="text-brand-primary font-semibold mt-1">${item.price}</p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><MapPin size={12} /> {item.location}</p>
                <p className="text-xs text-gray-400 mt-0.5">Seller: {item.seller}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
