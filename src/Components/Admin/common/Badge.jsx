const tones = {
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-brand-primary-light text-brand-primary',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-brand-secondary-light text-brand-secondary',
}

export const statusTone = (status) => {
  const map = {
    Active: 'success', Published: 'success', Available: 'success', Resolved: 'success', Matched: 'success', Closed: 'neutral',
    Pending: 'warning', Open: 'warning', Claimed: 'warning',
    Suspended: 'danger', Banned: 'danger', Flagged: 'danger', Sold: 'neutral', Rejected: 'danger',
  }
  return map[status] || 'neutral'
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
