import { useEffect, useRef, useState } from 'react';
import { MapPin, CalendarDays, Clock, Package, Pencil, Trash2 } from 'lucide-react';
import { useWorkspaceTranslation } from '@/locales/workspace/useWorkspaceTranslation';
import { useTheme } from '@/context/ThemeContext';
import { dateLabel, message, rows } from '@/features/workspace/workspaceModel';
import { useWorkspaceDataQuery, useWorkspaceSaveMutation } from '@/features/workspace/workspaceApi';
import { toast } from 'react-toastify';
import ReportDetails from '@/Components/PagesComponent/HomeComponent/Lost&FoundComponent/ReportDetails';

function inputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function EditReportForm({ item, onCancel, onSaved }) {
  const { w } = useWorkspaceTranslation();
  const categories = useWorkspaceDataQuery({ resource: 'categories' });
  const locations = useWorkspaceDataQuery({ resource: 'locations' });
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title').trim();
    const description = form.get('description').trim();
    const freeTextLocation = form.get('freeTextLocation').trim();
    const locationId = form.get('locationId');
    if (!title || !description || (!freeTextLocation && !locationId)) {
      setError(w('Enter an item name, description, and at least one location.'));
      return;
    }

    setError('');
    try {
      const hiddenDetail = form.get('hiddenDetail').trim();
      const updateBody = {
        itemType: form.get('itemType'),
        title,
        categoryId: form.get('categoryId') ? Number(form.get('categoryId')) : null,
        description,
        itemDate: form.get('itemDate'),
        scope: form.get('scope'),
        locationId: locationId ? Number(locationId) : null,
        freeTextLocation: freeTextLocation || null,
        photoUrl: form.get('photoUrl').trim() || null,
        // Preserve private details if the list endpoint does not return them.
        ...(hiddenDetail || item.hiddenDetail != null
          ? { hiddenDetail: hiddenDetail || null }
          : {}),
        // Coordinates are optional; avoid sending nulls to numeric API fields.
        ...(item.mapLat != null ? { mapLat: item.mapLat } : {}),
        ...(item.mapLng != null ? { mapLng: item.mapLng } : {}),
      };
      await save({
        resource: 'reports',
        action: 'update',
        id: item.id,
        body: updateBody,
      }).unwrap();
      toast.success(w('Report updated successfully.'));
      onSaved();
    } catch (failure) {
      setError(message(failure));
    }
  }

  const categoryRows = rows(categories.data);
  const locationRows = rows(locations.data);
  const initialLocationId = item.locationId ?? item.location?.id ?? '';

  return (
    <form className="uw-report-edit" onSubmit={submit} aria-busy={state.isLoading}>
      <div className="uw-report-edit-heading">
        <div><h3>{w('Edit report')}</h3><p>{w('Update the report information below.')}</p></div>
        <button type="button" className="uw-report-edit-cancel" onClick={onCancel}>{w('Cancel')}</button>
      </div>
      {error && <p className="uw-error" role="alert">{error}</p>}
      <div className="uw-report-edit-grid">
        <label>{w('Report type')}<select name="itemType" defaultValue={String(item.itemType || 'lost').toLowerCase()}><option value="lost">{w('Lost')}</option><option value="found">{w('Found')}</option></select></label>
        <label>{w('Item name')}<input name="title" required maxLength={300} defaultValue={item.title || ''} /></label>
        <label>{w('Date')}<input name="itemDate" type="date" required defaultValue={inputDate(item.itemDate || item.createdAt)} /></label>
        <label>{w('Scope')}<select name="scope" defaultValue={String(item.scope || 'istad').toLowerCase()}><option value="istad">{w('ISTAD Campus')}</option><option value="public">{w('Public Community')}</option></select></label>
        <label>{w('Category')}<select name="categoryId" defaultValue={item.categoryId ?? ''}><option value="">{w('Uncategorized')}</option>{item.categoryId != null && !categoryRows.some(category => String(category.id) === String(item.categoryId)) && <option value={item.categoryId}>{item.categoryName || item.category?.name || w('Current category')}</option>}{categoryRows.map(category => <option key={category.id} value={category.id}>{category.name || category.categoryName}</option>)}</select></label>
        <label>{w('Campus location')}<select name="locationId" defaultValue={initialLocationId}><option value="">{w('Other location')}</option>{initialLocationId && !locationRows.some(location => String(location.id) === String(initialLocationId)) && <option value={initialLocationId}>{item.locationLabel || item.location?.building || w('Current location')}</option>}{locationRows.map(location => <option key={location.id} value={location.id}>{[location.building, location.floor, location.room].filter(Boolean).join(', ')}</option>)}</select></label>
        <label className="uw-report-edit-wide">{w('Description')}<textarea name="description" required rows={4} defaultValue={item.description || ''} /></label>
        <label>{w('Location details')}<input name="freeTextLocation" defaultValue={item.freeTextLocation || (typeof item.location === 'string' ? item.location : '')} placeholder={w('Optional if a campus location is selected')} /></label>
        <label>{w('Photo URL')}<input name="photoUrl" type="url" defaultValue={item.photoUrl || ''} placeholder="https://" /></label>
        <label className="uw-report-edit-wide">{w('Private identifying detail')}<textarea name="hiddenDetail" rows={3} defaultValue={item.hiddenDetail || ''} /></label>
      </div>
      {(categories.isError || locations.isError) && <p className="uw-muted" role="alert">{w('Some category or location options could not be loaded. You can still update the report.')}</p>}
      <div className="uw-report-edit-actions"><button className="uw-button" type="submit" disabled={state.isLoading}>{state.isLoading ? w('Saving…') : w('Save changes')}</button><button className="uw-button secondary" type="button" onClick={onCancel} disabled={state.isLoading}>{w('Cancel')}</button></div>
    </form>
  );
}

export default function LostFoundReportRow({ item }) {
  const { w, locale } = useWorkspaceTranslation();
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState('');
  const [save, deleteState] = useWorkspaceSaveMutation();
  const cancelDeleteRef = useRef(null);
  const deleteTriggerRef = useRef(null);
  const found = item.itemType?.toLowerCase() === 'found';
  const date = item.itemDate || item.createdAt;
  const hasTime = typeof date === 'string' && date.includes('T') && !Number.isNaN(Date.parse(date));
  const location = item.freeTextLocation || item.locationLabel || item.location?.building || '—';
  const tags = [item.categoryName || item.category?.name, item.color].filter(Boolean);
  useEffect(() => {
    if (!confirmDelete) return undefined;
    cancelDeleteRef.current?.focus();
    return () => deleteTriggerRef.current?.focus();
  }, [confirmDelete]);

  async function removeReport() {
    setActionError('');
    try {
      await save({ resource: 'reports', action: 'delete', id: item.id }).unwrap();
      toast.success(w('Report deleted.'));
      setConfirmDelete(false);
    } catch (failure) {
      setActionError(message(failure));
    }
  }
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
      <div className="uw-report-actions">
        <button className="uw-button secondary uw-report-details" onClick={() => setOpen(true)}>{w('View Details')}</button>
        <button className="uw-button secondary uw-report-action" onClick={() => { setEditing(value => !value); setActionError(''); }} aria-expanded={editing}><Pencil size={15} />{w('Edit')}</button>
        <button ref={deleteTriggerRef} className="uw-button secondary uw-report-action danger" onClick={() => { setActionError(''); setConfirmDelete(true); }}><Trash2 size={15} />{w('Delete')}</button>
      </div>
    </article>
    {editing && <EditReportForm item={item} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />}
    {open && <ReportDetails report={{ ...item, location }} darkMode={darkMode} onClose={() => setOpen(false)} />}
    {confirmDelete && (
      <div
        className="uw-confirm-backdrop"
        onMouseDown={event => {
          if (event.target === event.currentTarget && !deleteState.isLoading) setConfirmDelete(false);
        }}
        onKeyDown={event => {
          if (event.key === 'Escape' && !deleteState.isLoading) setConfirmDelete(false);
          if (event.key === 'Tab') {
            event.preventDefault();
            const next = document.activeElement === cancelDeleteRef.current
              ? event.currentTarget.querySelector('[data-confirm-delete]')
              : cancelDeleteRef.current;
            next?.focus();
          }
        }}
      >
        <section className="uw-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`delete-title-${item.id}`} aria-describedby={`delete-description-${item.id}`}>
          <span className="uw-confirm-icon"><Trash2 size={21} /></span>
          <h2 id={`delete-title-${item.id}`}>{w('Delete this report?')}</h2>
          <p id={`delete-description-${item.id}`}>{w('This action cannot be undone. The report will be permanently removed.')}</p>
          {actionError && <p className="uw-confirm-error" role="alert">{actionError}</p>}
          <div className="uw-confirm-actions">
            <button ref={cancelDeleteRef} className="uw-button secondary" type="button" onClick={() => setConfirmDelete(false)} disabled={deleteState.isLoading}>{w('Cancel')}</button>
            <button data-confirm-delete className="uw-button uw-confirm-delete" type="button" onClick={removeReport} disabled={deleteState.isLoading}>
              {deleteState.isLoading ? <><span className="uw-confirm-spinner" aria-hidden="true" />{w('Deleting…')}</> : <><Trash2 size={16} />{w('Delete report')}</>}
            </button>
          </div>
        </section>
      </div>
    )}
  </>;
}
