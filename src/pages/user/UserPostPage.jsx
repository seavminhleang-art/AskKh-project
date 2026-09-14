import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Search } from 'lucide-react';
import { INITIAL_LOST_FOUND_ITEMS } from '../../constants/mockData';

const STORAGE_KEYS = { question: 'nexa_user_questions', item: 'nexa_user_lost_found_items', match: 'nexa_user_smart_matches' };

function saveEntry(kind, entry) {
  const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS[kind]) || '[]');
  window.localStorage.setItem(STORAGE_KEYS[kind], JSON.stringify([entry, ...stored]));
}

export default function UserPostPage({ kind }) {
  const navigate = useNavigate();
  const isQuestion = kind === 'question';
  const [form, setForm] = useState({ title: '', description: '', tags: '', type: 'LOST', location: '', image: '' });
  const [imageError, setImageError] = useState('');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const selectImage = (event) => {
    const file = event.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 900_000) {
      setImageError('Choose an image under 900 KB so it can be saved in this mock workspace.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    const timestamp = Date.now();
    if (isQuestion) {
      saveEntry('question', {
        id: `local-q-${timestamp}`, title: form.title, description: form.description,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), answers: [], views: 0,
        author: { name: 'You' }, createdAt: new Date().toISOString(),
      });
      navigate('/dashboard/questions');
    } else {
      const report = {
        id: `local-item-${timestamp}`, name: form.title, description: form.description, type: form.type,
        status: form.type, location: form.location, category: 'other', reporter: { name: 'You' },
        createdAt: new Date().toISOString(), images: form.image ? [form.image] : [],
      };
      saveEntry('item', report);
      const oppositeItem = INITIAL_LOST_FOUND_ITEMS.find((item) => item.type !== form.type);
      if (oppositeItem) {
        saveEntry('match', {
          id: `local-match-${timestamp}`,
          lostItem: form.type === 'LOST' ? report : oppositeItem,
          foundItem: form.type === 'FOUND' ? report : oppositeItem,
          matchScore: form.image ? 78 : 64,
          status: 'NEW', createdAt: new Date().toISOString(),
          matchingAttributes: [
            { label: 'Report type', score: 'Compatible', detail: 'A lost report was paired with a found report.' },
            { label: 'Photo signal', score: form.image ? 'Included' : 'Missing', detail: form.image ? 'Your uploaded image will help campus staff verify the match.' : 'Add a photo to improve match confidence.' },
          ],
        });
      }
      navigate('/dashboard/lost-found');
    }
  };

  const Icon = isQuestion ? HelpCircle : Search;
  const title = isQuestion ? 'Ask a question' : 'Report a lost or found item';

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-lg">
        <Icon className="mb-3 h-7 w-7" /><h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-1 text-sm text-blue-100">This is saved locally in your browser for the current mock workspace.</p>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {!isQuestion && <label className="block text-sm font-semibold">Report type<select name="type" value={form.type} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"><option value="LOST">I lost an item</option><option value="FOUND">I found an item</option></select></label>}
        <label className="block text-sm font-semibold">{isQuestion ? 'Question title' : 'Item name'}<input required name="title" value={form.title} onChange={update} placeholder={isQuestion ? 'e.g. How do I ...?' : 'e.g. Blue student ID card'} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800" /></label>
        {!isQuestion && <label className="block text-sm font-semibold">Where was it lost or found?<input required name="location" value={form.location} onChange={update} placeholder="e.g. Lab 302, third floor" className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800" /></label>}
        {!isQuestion && <label className="block text-sm font-semibold">Photo <span className="font-normal text-slate-500">(optional, under 900 KB)</span><input type="file" accept="image/*" onChange={selectImage} className="mt-2 block w-full text-sm" />{imageError && <p className="mt-1 text-xs text-rose-600">{imageError}</p>}{form.image && <img src={form.image} alt="Selected item preview" className="mt-3 h-36 w-48 rounded-xl object-cover" />}</label>}
        {isQuestion && <label className="block text-sm font-semibold">Tags <span className="font-normal text-slate-500">(comma separated)</span><input name="tags" value={form.tags} onChange={update} placeholder="react, javascript" className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800" /></label>}
        <label className="block text-sm font-semibold">Description<textarea required name="description" value={form.description} onChange={update} rows="6" placeholder="Add enough detail so classmates or campus staff can help." className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800" /></label>
        <div className="flex justify-end gap-3"><button type="button" onClick={() => navigate(-1)} className="rounded-xl px-4 py-2 text-sm font-semibold">Cancel</button><button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Publish</button></div>
      </form>
    </section>
  );
}
