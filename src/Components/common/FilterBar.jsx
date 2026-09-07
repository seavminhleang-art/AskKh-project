import React from 'react';
import { Filter } from 'lucide-react';
import Select from '../ui/Select';
import { cn } from '@/lib/utils';

export default function FilterBar({
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  sortOptions = [],
  selectedSort = '',
  onSortChange,
  statusOptions = [],
  selectedStatus = 'all',
  onStatusChange,
  className = '',
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {categories.length > 0 && (
        <div className="min-w-[170px]">
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {statusOptions.length > 0 && onStatusChange && (
        <div className="min-w-[140px]">
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {sortOptions.length > 0 && onSortChange && (
        <div className="min-w-[150px]">
          <Select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
