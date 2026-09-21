import { useState } from 'react';
import { MapPin, CalendarDays, Clock, Package } from 'lucide-react';
import { useWorkspaceTranslation } from '@/locales/workspace/useWorkspaceTranslation';
import { useTheme } from '@/context/ThemeContext';
import { dateLabel } from '@/features/workspace/workspaceModel';
import ReportDetails from '@/Components/PagesComponent/HomeComponent/Lost&FoundComponent/ReportDetails';

export default function LostFoundReportRow({ item }) {
  const { w, locale } = useWorkspaceTranslation();
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const found = item.itemType?.toLowerCase() === 'found';
  const date = item.itemDate || item.createdAt;
  const hasTime = typeof date === 'string' && date.includes('T') && !Number.isNaN(Date.parse(date));
  const location = item.freeTextLocation || item.locationLabel || item.location?.building || '—';
  const tags = [item.categoryName || item.category?.name, item.color].filter(Boolean);
  return <>
    <article className="uw-report-row">
      <div className="uw-report-photo">{item.photoUrl ? <img src={item.photoUrl} alt={item.title || ''} loading="lazy" /> : <Package size={26} aria-label={w('No image')} />}</div>
      <div className="uw-report-description">
        <span className={`uw-report-type ${found ? 'found' : 'lost'}`}>{w(found ? 'Found' : 'Lost')}</span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        {!!tags.length && <div className="uw-report-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
      </div>
      <div className="uw-report-meta">
        <span><MapPin size={13} />{location}</span>
        <span><CalendarDays size={13} />{dateLabel(date, locale)}</span>
        {hasTime && <span><Clock size={13} />{new Date(date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
      <button className="uw-button secondary uw-report-details" onClick={() => setOpen(true)}>{w('View Details')}</button>
    </article>
    {open && <ReportDetails report={{ ...item, location }} darkMode={darkMode} onClose={() => setOpen(false)} />}
  </>;
}
