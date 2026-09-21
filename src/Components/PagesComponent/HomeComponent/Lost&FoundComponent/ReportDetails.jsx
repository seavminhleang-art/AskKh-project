import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommunityAuth } from '@/features/lostFound/useCommunityAuth';
import { useCommunityReportQuery } from '@/features/lostFound/communityApi';
import { useWorkspaceSaveMutation } from '@/features/workspace/workspaceApi';
import { message } from '@/features/workspace/workspaceModel';

export default function ReportDetails({ report, onClose, darkMode }) {
  const dialog = useRef(null);
  const query = useCommunityReportQuery(report.id);
  const [save, state] = useWorkspaceSaveMutation();
  const authenticated = useCommunityAuth();
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { dialog.current.showModal(); }, []);
  const item = query.data?.data || query.data;
  async function submit(event) {
    event.preventDefault();
    const detail = new FormData(event.currentTarget).get('detail').trim();
    if (!detail || state.isLoading) return;
    setError('');
    try {
      await save({ resource: 'claims', action: 'create', id: report.id, body: { describedHiddenDetail: detail } }).unwrap();
      setSubmitted(true);
    } catch (error) { setError(message(error)); }
  }
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} className={`m-auto w-full max-w-xl rounded-3xl p-6 backdrop:bg-black/60 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'}`}>
    <button onClick={onClose} className="float-right p-2" aria-label="Close report">✕</button>
    {query.isLoading && <p role="status">Loading report…</p>}
    {query.isError && <p role="alert">{message(query.error)} <button onClick={query.refetch}>Retry</button></p>}
    {item && <div className="space-y-4">
      <h2 className="text-xl font-bold">{item.title}</h2>
      {item.photoUrl && <img src={item.photoUrl} alt={item.title} className="max-h-64 rounded-xl object-contain" />}
      <p className="whitespace-pre-wrap">{item.description}</p>
      <p>{item.freeTextLocation || report.location} · {item.itemDate}</p>
      {String(item.itemType).toLowerCase() === 'found' && (submitted ? <p role="status">Your claim was submitted successfully.</p> : !authenticated ? <Link to="/login">Sign in to verify ownership</Link> : <form onSubmit={submit} className="space-y-3">
        <label className="block">Describe a private detail that proves this item belongs to you.
          <textarea name="detail" required rows={4} className="block w-full rounded-xl border p-3 mt-2" />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={state.isLoading} className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{state.isLoading ? 'Submitting…' : 'Submit claim'}</button>
      </form>)}
    </div>}
  </dialog>;
}
