import { Link } from 'react-router-dom';
import { Bell, Bookmark, HelpCircle, MapPin, Search, Sparkles } from 'lucide-react';
import {
  INITIAL_CLAIMS,
  INITIAL_LOST_FOUND_ITEMS,
  INITIAL_SMART_MATCHES,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUESTIONS,
} from '../../constants/mockData';

const PAGE_CONFIG = {
  questions: { title: 'Questions', description: 'Browse technical discussions from the campus community.', icon: HelpCircle, items: INITIAL_QUESTIONS },
  'lost-found': { title: 'Lost & Found', description: 'Review reported lost and found items on campus.', icon: Search, items: INITIAL_LOST_FOUND_ITEMS },
  matches: { title: 'Smart Matches', description: 'Potential matches found for reported belongings.', icon: Sparkles, items: INITIAL_SMART_MATCHES },
  claims: { title: 'My Claims', description: 'Track ownership-verification requests.', icon: Bookmark, items: INITIAL_CLAIMS },
  notifications: { title: 'Notifications', description: 'Your recent account and campus updates.', icon: Bell, items: INITIAL_NOTIFICATIONS },
};

function ItemSummary({ page, item }) {
  if (page === 'questions') return <><h2>{item.title}</h2><p>{item.description}</p><small>{item.answers.length} answers · {item.views} views</small></>;
  if (page === 'lost-found') return <><h2>{item.name}</h2><p>{item.description}</p><small><MapPin className="inline h-3.5 w-3.5" /> {item.location} · {item.status}</small></>;
  if (page === 'matches') return <><h2>{item.lostItem.name} ↔ {item.foundItem.name}</h2><p>{item.matchingAttributes[0]?.detail}</p><small>{item.matchScore}% confidence · {item.status}</small></>;
  if (page === 'claims') return <><h2>{item.item.name}</h2><p>{item.proofDescription}</p><small>Claim #{item.id} · {item.status}</small></>;
  return <><h2>{item.title}</h2><p>{item.message}</p><small>{item.isRead ? 'Read' : 'New'} · {new Date(item.createdAt).toLocaleDateString()}</small></>;
}

export default function WorkspaceListPage({ page }) {
  const config = PAGE_CONFIG[page];
  const Icon = config.icon;
  const storageKey = page === 'questions' ? 'nexa_user_questions' : page === 'lost-found' ? 'nexa_user_lost_found_items' : null;
  const localItems = storageKey ? JSON.parse(window.localStorage.getItem(storageKey) || '[]') : [];
  const localMatches = page === 'matches' ? JSON.parse(window.localStorage.getItem('nexa_user_smart_matches') || '[]') : [];
  const items = [...localItems, ...localMatches, ...config.items];
  const createPath = page === 'questions' ? '/dashboard/questions/new' : page === 'lost-found' ? '/dashboard/lost-found/new' : null;

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex items-start gap-4 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-lg">
        <div className="rounded-2xl bg-white/15 p-3"><Icon className="h-6 w-6" /></div>
        <div className="flex-1"><h1 className="text-2xl font-black">{config.title}</h1><p className="mt-1 text-sm text-blue-100">{config.description}</p></div>
        {createPath && <Link to={createPath} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700">+ Create</Link>}
      </header>

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-5 transition dark:bg-slate-900">
            {page === 'lost-found' && item.images?.[0] && <img src={item.images[0]} alt={item.name} className="mb-4 h-44 w-full rounded-xl object-cover sm:w-64" />}
            {page === 'matches' && (item.lostItem.images?.[0] || item.foundItem.images?.[0]) && <div className="mb-4 flex gap-3"><img src={item.lostItem.images?.[0] || item.foundItem.images?.[0]} alt="Matched item" className="h-24 w-24 rounded-xl object-cover" /><img src={item.foundItem.images?.[0] || item.lostItem.images?.[0]} alt="Matched item" className="h-24 w-24 rounded-xl object-cover" /></div>}
            <ItemSummary page={page} item={item} />
          </article>
        ))}
      </div>

      <Link to="/dashboard" className="inline-flex text-sm font-semibold text-blue-600 hover:underline">← Back to dashboard</Link>
    </section>
  );
}
