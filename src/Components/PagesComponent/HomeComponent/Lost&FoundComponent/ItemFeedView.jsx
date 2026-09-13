import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, ShieldCheck, Search, PlusCircle, Tag, Building2 } from 'lucide-react';

const sampleItems = [
  {
    id: 1,
    type: 'LOST',
    title: 'ASUS ROG Strix G15 Gaming Laptop',
    description: 'Gaming laptop with illuminated ROG logo, RGB keyboard, and angular cooling vents. Left behind after system setup session.',
    location: 'ISTAD, Mobile Lab, Lower Floor',
    timeAgo: '3 min read',
    reporter: 'Jude Bellingham',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    category: 'Electronics'
  },
  {
    id: 2,
    type: 'LOST',
    title: 'SAPPHIRE Silver Wristwatch',
    description: 'Elegant silver wristwatch with dark navy dial and date display window. Stainless steel band with polished finish. Last seen near hallway seating area after afternoon lecture.',
    location: 'ISTAD, Mobile Lab, Lower Floor',
    timeAgo: '1 hours read',
    reporter: 'Jude Bellingham',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    category: 'Accessories'
  },
  {
    id: 3,
    type: 'FOUND',
    title: 'Casual Navy Jacket',
    description: 'Elegant dark navy jacket with corduroy collar. Found hanging near the hallway seating area.',
    location: 'ISTAD, Mobile Lab, Lower Floor',
    timeAgo: '20 min read',
    reporter: 'Jude Bellingham',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80',
    category: 'Clothing'
  }
];

const categories = [
  { name: 'All Categories', count: 48 },
  { name: 'Electronics', count: 12 },
  { name: 'Bags', count: 8 },
  { name: 'Clothing', count: 9 },
  { name: 'Accessories', count: 6 },
  { name: 'Keys', count: 5 },
  { name: 'Books & Documents', count: 4 },
  { name: 'Others', count: 4 }
];

const locations = [
  { name: 'Library Building', count: 14 },
  { name: 'Cafeteria', count: 9 },
  { name: 'Student Center', count: 7 },
  { name: 'Main Entrance', count: 6 },
  { name: 'Parking Area', count: 5 }
];

function HeroScanBackground({ darkMode }) {
  const grid = darkMode ? 'rgba(148,163,184,0.22)' : 'rgba(100,116,139,0.14)';

  const blue = darkMode ? 'rgba(96,165,250,0.9)' : 'rgba(37,99,235,0.55)';
  const blueSoft = darkMode ? 'rgba(96,165,250,0.35)' : 'rgba(37,99,235,0.22)';
  const pink = darkMode ? 'rgba(244,114,182,0.9)' : 'rgba(219,39,119,0.5)';
  const pinkSoft = darkMode ? 'rgba(244,114,182,0.35)' : 'rgba(219,39,119,0.2)';
  const purple = darkMode ? 'rgba(167,139,250,0.9)' : 'rgba(124,58,237,0.5)';
  const purpleSoft = darkMode ? 'rgba(167,139,250,0.35)' : 'rgba(124,58,237,0.2)';
  const teal = darkMode ? 'rgba(45,212,191,0.9)' : 'rgba(13,148,136,0.5)';
  const tealSoft = darkMode ? 'rgba(45,212,191,0.35)' : 'rgba(13,148,136,0.2)';
  const amber = darkMode ? 'rgba(251,191,36,0.9)' : 'rgba(217,119,6,0.5)';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes heroSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes heroSpinSlowReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes heroPulseDot { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
        @keyframes heroSweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        @keyframes heroFadeDrift { 0%, 100% { opacity: 0.2; transform: translateY(0px); } 50% { opacity: 0.55; transform: translateY(-6px); } }
        @keyframes heroGlowDrift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -14px) scale(1.12); } }
        @keyframes heroGlowDrift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 16px) scale(1.15); } }
        @keyframes heroGlowDrift3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(14px, 18px) scale(1.1); } }
        .hero-scan-ring-outer { animation: heroSpinSlow 34s linear infinite; }
        .hero-scan-ring-inner { animation: heroSpinSlowReverse 22s linear infinite; }
        .hero-scan-ring-mid { animation: heroSpinSlow 26s linear infinite; }
        .hero-scan-dot { animation: heroPulseDot 2.4s ease-in-out infinite; }
        .hero-scan-sweep { animation: heroSweep 7s ease-in-out infinite; }
        .hero-scan-node { animation: heroFadeDrift 5s ease-in-out infinite; }
        .hero-glow-1 { animation: heroGlowDrift1 14s ease-in-out infinite; }
        .hero-glow-2 { animation: heroGlowDrift2 17s ease-in-out infinite; }
        .hero-glow-3 { animation: heroGlowDrift3 20s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-scan-ring-outer, .hero-scan-ring-inner, .hero-scan-ring-mid, .hero-scan-dot,
          .hero-scan-sweep, .hero-scan-node, .hero-glow-1, .hero-glow-2, .hero-glow-3 {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="hero-glow-1 absolute -left-16 -top-16 w-64 h-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${blueSoft}, transparent 70%)` }}
      />
      <div
        className="hero-glow-2 absolute -right-10 top-0 w-72 h-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${pinkSoft}, transparent 70%)` }}
      />
      <div
        className="hero-glow-3 absolute left-1/3 -bottom-24 w-80 h-80 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${purpleSoft}, transparent 70%)` }}
      />
      <div
        className="hero-glow-1 absolute right-1/4 -bottom-16 w-56 h-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${tealSoft}, transparent 70%)`, animationDelay: '3s' }}
      />

      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="heroGridFeed" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke={grid} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGridFeed)" />
      </svg>

      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 opacity-90">
        <svg viewBox="0 0 200 200" className="w-full h-full hero-scan-ring-outer">
          <circle cx="100" cy="100" r="92" fill="none" stroke={blue} strokeWidth="1" strokeDasharray="6 10" />
        </svg>
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-mid">
          <circle cx="100" cy="100" r="70" fill="none" stroke={pink} strokeWidth="1" strokeDasharray="2 6" />
        </svg>
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-inner">
          <circle cx="100" cy="100" r="48" fill="none" stroke={teal} strokeWidth="1.2" />
          <circle cx="100" cy="188" r="3" fill={purple} className="hero-scan-dot" />
          <circle cx="12" cy="100" r="3" fill={amber} className="hero-scan-dot" style={{ animationDelay: '0.9s' }} />
        </svg>
      </div>

      <div className="absolute -right-20 top-8 w-56 h-56 opacity-80">
        <svg viewBox="0 0 200 200" className="w-full h-full hero-scan-ring-inner">
          <circle cx="100" cy="100" r="80" fill="none" stroke={purple} strokeWidth="1" strokeDasharray="4 8" />
        </svg>
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-mid">
          <circle cx="100" cy="100" r="56" fill="none" stroke={teal} strokeWidth="1.2" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
        <g fill="none" strokeWidth="1">
          <path d="M60 40 L60 90 L140 90" stroke={blue} />
          <path d="M900 260 L900 210 L820 210" stroke={pink} />
          <path d="M480 20 L480 55" stroke={teal} />
          <path d="M520 280 L520 245" stroke={purple} />
          <path d="M760 40 L800 40 L800 80" stroke={amber} />
        </g>
        <circle className="hero-scan-node" cx="60" cy="40" r="3.5" fill={blue} />
        <circle className="hero-scan-node" cx="140" cy="90" r="3" fill={pink} style={{ animationDelay: '0.6s' }} />
        <circle className="hero-scan-node" cx="900" cy="260" r="3.5" fill={pink} style={{ animationDelay: '1.1s' }} />
        <circle className="hero-scan-node" cx="820" cy="210" r="3" fill={purple} style={{ animationDelay: '1.7s' }} />
        <circle className="hero-scan-node" cx="480" cy="20" r="3" fill={teal} style={{ animationDelay: '0.3s' }} />
        <circle className="hero-scan-node" cx="520" cy="280" r="3" fill={amber} style={{ animationDelay: '2s' }} />
        <circle className="hero-scan-node" cx="800" cy="80" r="3" fill={amber} style={{ animationDelay: '1.4s' }} />
        <circle className="hero-scan-node" cx="760" cy="40" r="2.5" fill={blue} style={{ animationDelay: '2.4s' }} />
      </svg>

      <div
        className="hero-scan-sweep absolute top-0 left-0 h-full w-1/3"
        style={{
          background: darkMode
            ? 'linear-gradient(90deg, transparent, rgba(96,165,250,0.10), rgba(244,114,182,0.10), rgba(45,212,191,0.10), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.09), rgba(219,39,119,0.09), rgba(13,148,136,0.09), transparent)'
        }}
      />
    </div>
  );
}

export default function ItemFeedView({ onOpenReport, setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Newest');

  const filteredItems = sampleItems.filter((item) => {
    const matchesTab =
      activeTab === 'All Items' ||
      (activeTab === 'Lost Items' && item.type === 'LOST') ||
      (activeTab === 'Found Items' && item.type === 'FOUND');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  return (
    <section className="mb-20 relative z-10 font-[family-name:var(--font-brand)]">
      <motion.div
        onMouseEnter={() => {
          if (setCursorText && setIsHovered) {
            setCursorText(t('feedExploreCursor'));
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => setIsHovered && setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`relative backdrop-blur-md rounded-3xl shadow-sm overflow-hidden mb-8 transition-colors duration-300 ${
          darkMode
            ? 'bg-zinc-900/90 border border-zinc-800'
            : 'bg-white/95 border border-gray-100'
        }`}
      >
        <HeroScanBackground darkMode={darkMode} />

        <div className="relative z-10 text-center py-12 md:py-16 px-6">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 border ${
            darkMode 
              ? 'bg-blue-950/60 text-blue-400 border-blue-900' 
              : 'bg-blue-50 text-[var(--color-brand-primary,#3b82f6)] border-blue-100'
          }`}>
            <ShieldCheck size={14} /> {t('feedBadge')}
          </span>
          <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('feedHeroTitle1')} <span className="text-[var(--color-brand-primary,#3b82f6)]">{t('feedHeroTitle2')}</span>
          </h1>
          <p className={`max-w-2xl mx-auto leading-relaxed text-sm md:text-base ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {t('feedHeroDescription')}
          </p>

          <div className="mt-8">
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('feedActiveRecoveryTitle')}
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              {t('feedActiveRecoverySub')}
            </p>
          </div>
        </div>
      </motion.div>

      <main className="w-full">
        <div className={`flex border-b mb-6 gap-8 ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
          {[
            { key: 'All Items', label: t('feedTabAll') },
            { key: 'Lost Items', label: t('feedTabLost') },
            { key: 'Found Items', label: t('feedTabFound') }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              onMouseEnter={() => {
                if (setCursorText && setIsHovered) {
                  setCursorText(`${t('feedViewTabPrefix')} ${tab.label}`);
                  setIsHovered(true);
                }
              }}
              onMouseLeave={() => setIsHovered && setIsHovered(false)}
              className={`pb-3 text-sm font-semibold relative transition-colors ${
                activeTab === tab.key
                  ? 'text-[var(--color-brand-primary,#3b82f6)] font-bold'
                  : darkMode
                  ? 'text-slate-400 hover:text-slate-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-brand-primary,#3b82f6)] rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder={t('feedSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#3b82f6)]/40 ${
                darkMode
                  ? 'bg-zinc-900/90 border border-zinc-800 text-slate-100 placeholder-zinc-500'
                  : 'bg-white/95 border border-gray-100 text-gray-800 placeholder-gray-400 shadow-sm'
              }`}
            />
            <Search size={16} className={`absolute left-3 top-3.5 ${darkMode ? 'text-zinc-500' : 'text-gray-400'}`} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`rounded-2xl px-3.5 py-2.5 text-xs outline-none cursor-pointer font-medium transition-colors ${
                darkMode
                  ? 'bg-zinc-900/90 border border-zinc-800 text-slate-200'
                  : 'bg-white/95 border border-gray-100 text-gray-800 shadow-sm'
              }`}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat.name} className={darkMode ? 'bg-zinc-900 text-slate-100' : 'bg-white text-gray-800'}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-2xl px-3.5 py-2.5 text-xs outline-none cursor-pointer font-medium transition-colors ${
                darkMode
                  ? 'bg-zinc-900/90 border border-zinc-800 text-slate-200'
                  : 'bg-white/95 border border-gray-100 text-gray-800 shadow-sm'
              }`}
            >
              <option value="Newest" className={darkMode ? 'bg-zinc-900 text-slate-100' : 'bg-white text-gray-800'}>{t('feedSortNewest')}</option>
              <option value="Oldest" className={darkMode ? 'bg-zinc-900 text-slate-100' : 'bg-white text-gray-800'}>{t('feedSortOldest')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {filteredItems.length === 0 ? (
              <div className={`backdrop-blur-md rounded-3xl p-12 text-center text-sm font-medium ${
                darkMode ? 'bg-zinc-900/90 border border-zinc-800 text-slate-400' : 'bg-white/95 border border-gray-100 text-gray-500'
              }`}>
                {t('feedNoItemsFound')}
              </div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  onMouseEnter={() => {
                    if (setCursorText && setIsHovered) {
                      setCursorText(`${t('feedInspectPrefix')} ${item.type}`);
                      setIsHovered(true);
                    }
                  }}
                  onMouseLeave={() => setIsHovered && setIsHovered(false)}
                  whileHover={{ scale: 1.01, x: 2 }}
                  transition={{ duration: 0.2 }}
                  className={`backdrop-blur-md rounded-3xl p-5 shadow-sm transition-colors duration-300 flex flex-col md:flex-row gap-6 relative group ${
                    darkMode
                      ? 'bg-zinc-900/90 border border-zinc-800 text-slate-100'
                      : 'bg-white/95 border border-gray-100 text-gray-800'
                  }`}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`inline-block text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        item.type === 'LOST'
                          ? darkMode
                            ? 'bg-red-950/80 text-red-400 border border-red-800'
                            : 'bg-red-50 text-red-600 font-bold'
                          : darkMode
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          : 'bg-amber-50 text-amber-600 font-bold'
                      }`}
                    >
                      {item.type === 'LOST' ? t('recStatusLost') : t('recStatusFound')}
                    </span>
                  </div>

                  <div className={`w-full md:w-56 h-48 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 ${
                    darkMode ? 'bg-zinc-950/60 border border-zinc-800' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain transform group-hover:scale-105 transition duration-500" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between pt-6 md:pt-0">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1 text-red-500 font-medium">
                          <MapPin size={13} /> {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {item.timeAgo}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>

                    <div className={`flex items-center justify-between pt-4 mt-2 border-t ${
                      darkMode ? 'border-zinc-800 text-slate-400' : 'border-gray-100 text-gray-600'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <img src={item.avatar} alt={item.reporter} className="w-7 h-7 rounded-full object-cover" />
                        <span className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          {item.reporter}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onMouseEnter={() => {
                          if (setCursorText && setIsHovered) {
                            setCursorText(t('feedClaimCursor'));
                            setIsHovered(true);
                          }
                        }}
                        onMouseLeave={() => setIsHovered && setIsHovered(false)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                          darkMode
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/90'
                            : 'bg-emerald-50 text-[var(--color-brand-accent,#10b981)] hover:bg-emerald-100'
                        }`}
                      >
                        {t('recVerifyBtn')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div className={`backdrop-blur-md rounded-3xl p-5 shadow-sm transition-colors duration-300 ${
              darkMode ? 'bg-zinc-900/90 border border-zinc-800 text-slate-100' : 'bg-white/95 border border-gray-100 text-gray-800'
            }`}>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
                darkMode
                  ? 'bg-zinc-800 text-[var(--color-brand-primary,#3b82f6)] border border-zinc-700'
                  : 'bg-[var(--color-brand-primary-light,#eff6ff)] text-[var(--color-brand-primary,#3b82f6)]'
              }`}>
                <Tag size={12} className="inline mr-1" /> {t('feedCategoriesTitle')}
              </span>
              <ul className="space-y-3">
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    onMouseEnter={() => {
                      if (setCursorText && setIsHovered) {
                        setCursorText(`${t('feedFilterPrefix')} ${cat.name}`);
                        setIsHovered(true);
                      }
                    }}
                    onMouseLeave={() => setIsHovered && setIsHovered(false)}
                    className="flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <span className={selectedCategory === cat.name ? 'font-bold text-[var(--color-brand-primary,#3b82f6)]' : darkMode ? 'text-slate-300' : 'text-gray-700'}>
                      {cat.name}
                    </span>
                    <span className={darkMode ? 'text-slate-500' : 'text-gray-400'}>{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`backdrop-blur-md rounded-3xl p-5 shadow-sm transition-colors duration-300 ${
              darkMode ? 'bg-zinc-900/90 border border-zinc-800 text-slate-100' : 'bg-white/95 border border-gray-100 text-gray-800'
            }`}>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
                darkMode
                  ? 'bg-zinc-800 text-[var(--color-brand-secondary,#ec4899)] border border-zinc-700'
                  : 'bg-[var(--color-brand-secondary-light,#fdf2f8)] text-[var(--color-brand-secondary,#ec4899)]'
              }`}>
                <Building2 size={12} className="inline mr-1" /> {t('feedPopularLocationsTitle')}
              </span>
              <ul className="space-y-3">
                {locations.map((loc, idx) => (
                  <li
                    key={idx}
                    onMouseEnter={() => {
                      if (setCursorText && setIsHovered) {
                        setCursorText(`${t('feedFilterPrefix')} ${loc.name}`);
                        setIsHovered(true);
                      }
                    }}
                    onMouseLeave={() => setIsHovered && setIsHovered(false)}
                    className={`flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span>{loc.name}</span>
                    <span className={darkMode ? 'text-slate-500' : 'text-gray-400'}>{loc.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={onOpenReport}
              onMouseEnter={() => {
                if (setCursorText && setIsHovered) {
                  setCursorText(t('feedCreateReportCursor'));
                  setIsHovered(true);
                }
              }}
              onMouseLeave={() => setIsHovered && setIsHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[var(--color-brand-primary,#3b82f6)] hover:opacity-90 text-white font-semibold py-3.5 px-4 rounded-2xl text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} /> {t('feedReportBtn')}
            </motion.button>
          </div>
        </div>
      </main>
    </section>
  );
}