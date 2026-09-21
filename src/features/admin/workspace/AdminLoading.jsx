import { LoaderCircle } from 'lucide-react';
import LoadingSpinner from '@/Components/common/LoadingSpinner';

export default function AdminLoading({ label = 'dashboard', compact = false }) {
  if (compact) return <div className="al-loading-progress" role="status" aria-live="polite"><LoaderCircle size={18} className="al-loading-spin" aria-hidden="true"/><span>Loading {label}…</span></div>;
  return <div className="al-loading" aria-busy="true"><LoadingSpinner fullScreen={false} title={`Loading ${label}`} subtitle="Please wait while your data loads."/></div>;
}
