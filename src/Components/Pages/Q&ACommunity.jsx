
import React, { useRef, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SidebarLeft from '../miniComponent/SidebarLeft';
import PostCard from '../miniComponent/PostCard';
import CreatePostView from '../miniComponent/CreatePostView';
import DetailView from '../miniComponent/DetailView';
import { useLanguage } from '../Language/LanguageContext.jsx';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';

import { useSelector } from 'react-redux';
import { useGetPostsQuery, useGetPostByIdQuery, useCreatePostMutation, useCreatePostWithImagesMutation } from '../../features/posts/postApi';
import { useGetBookmarksQuery, useAddBookmarkMutation, useRemoveBookmarkMutation } from '../../features/bookmarks/bookmarkApi';
import { useVotePostMutation, useDeleteVoteMutation } from '../../features/votes/voteApi';
import { rowsOf, savedPosts, mapPost, errorMessage } from '../../features/qa/model';

const googleSansStyle = {
  fontFamily: '"Google Sans",sans-serif'
};

export default function QACommunity({ darkMode: propDarkMode, language: propLanguage }) {
  const context = useOutletContext();
  const { language } = useLanguage();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = propLanguage ?? language ?? 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;

  const [activeTab, setActiveTab] = useState('newest');

  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const userId = user?.id ?? user?.userId;
  const feed = useGetPostsQuery();
  const bookmarks = useGetBookmarksQuery(undefined, { skip: !isAuthenticated });
  const detail = useGetPostByIdQuery(selectedPostId, { skip: selectedPostId == null });
  const [createPost] = useCreatePostMutation();
  const [createWithImages] = useCreatePostWithImagesMutation();
  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();
  const [votePost] = useVotePostMutation();
  const [deleteVote] = useDeleteVoteMutation();
  const [votes, setVotes] = useState({});
  const [error, setError] = useState('');
  const busy = useRef(new Set());
  const saved = isAuthenticated ? savedPosts(bookmarks.data) : [];
  const bookmarkedPostIds = saved.map(post => post.id);
  const posts = rowsOf(feed.data).filter(post => post.postTypeId !== 2).map(post => ({ ...mapPost(post, userId), isLiked: Boolean(votes[`${userId}:${post.id}`]) }));
  const requireAuth = () => { if (isAuthenticated) return true; navigate('/login'); return false; };
  const handleSelectPost = id => setSelectedPostId(id);
  async function perform(key, action) {
    if (!requireAuth() || busy.current.has(key)) return;
    busy.current.add(key); setError('');
    try { await action(); } catch (error) { setError(errorMessage(error)); }
    finally { busy.current.delete(key); }
  }
  const handleToggleLike = id => perform(`vote:${id}`, async () => {
    const key = `${userId}:${id}`;
    if (votes[key]) { await deleteVote(votes[key]).unwrap(); setVotes(previous => ({ ...previous, [key]: null })); }
    else { const result = await votePost({ postId: id, voteTypeId: 1 }).unwrap(); setVotes(previous => ({ ...previous, [key]: result.id })); }
  });
  const toggleBookmark = id => perform(`bookmark:${id}`, async () => {
    if (bookmarks.isFetching || bookmarks.isError) throw new Error('Wait for saved posts to load, then try again.');
    await (bookmarkedPostIds.includes(id) ? removeBookmark(id) : addBookmark(id)).unwrap();
  });
  const handleAddPost = async ({ imageFile, ...body }) => {
    if (!isAuthenticated) throw new Error('Please sign in before publishing.');
    if (imageFile) {
      const form = new FormData();
      form.append('post', new Blob([JSON.stringify(body)], { type: 'application/json' }));
      form.append('images', imageFile);
      await createWithImages(form).unwrap();
    } else await createPost(body).unwrap();
    setIsCreatingPost(false); setActiveTab('newest');
  };

  const displayedPosts = activeTab === 'bookmarks' 
    ? saved.map(post => mapPost(post, userId))
    : activeTab === 'following'
    ? posts.filter(post => post.isOwnPost)
    : [...posts].filter(post => !selectedTag || post.tags.includes(selectedTag)).sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

  const selectedPost = detail.currentData ? mapPost(detail.currentData, userId) : [...posts, ...saved.map(post => mapPost(post, userId))].find(p => p.id === selectedPostId);

  return (
    <div 
      style={googleSansStyle} 
      className={`shared-theme shared-page min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {feed.isLoading && <p role="status" className="p-4">Loading posts…</p>}
        {feed.isError && <p role="alert" className="p-4">Could not load posts. <button onClick={feed.refetch}>Retry</button></p>}
        {activeTab === 'bookmarks' && bookmarks.isError && <p role="alert">Could not load bookmarks. <button onClick={bookmarks.refetch}>Retry</button></p>}
        {detail.isError && selectedPostId != null && <p role="alert">Could not load post details. <button onClick={detail.refetch}>Retry</button></p>}
        <div className={`grid grid-cols-1 items-start gap-4 lg:gap-6 lg:grid-cols-[224px_minmax(0,1fr)] ${isCreatingPost ? "" : "xl:grid-cols-[224px_minmax(0,1fr)_288px] 2xl:grid-cols-[256px_minmax(0,1fr)_288px]"}`}>
          <SidebarLeft
            darkMode={darkMode}
            language={currentLang}
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab); setSelectedTag(null);
              setIsCreatingPost(false);
              setSelectedPostId(null);
            }} 
            onSelectTag={tag => { setSelectedTag(tag); setActiveTab("newest"); setSelectedPostId(null); setIsCreatingPost(false); }}
            savedCount={bookmarkedPostIds.length} 
          />

          {isCreatingPost ? (
            <CreatePostView 
              darkMode={darkMode}
              language={currentLang}
              onAddPost={handleAddPost} 
              onCancel={() => setIsCreatingPost(false)} 
            />
          ) : selectedPost ? (
            <DetailView 
              darkMode={darkMode}
              language={currentLang}
              post={selectedPost} 
              onBack={() => setSelectedPostId(null)} 
              key={selectedPost.id}
            />
          ) : (
            <div className="min-w-0 space-y-4">
              {/* Post Trigger Input */}
              <div className={`rounded-2xl p-2.5 flex items-center space-x-3 transition-colors ${
                darkMode ? "bg-zinc-900" : "bg-white"
              }`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">{(user?.displayName || user?.name || "?").slice(0, 1)}</span>
                <input 
                  type="text" 
                  placeholder={t.post.placeholderInput}
                  onClick={() => { if (requireAuth()) setIsCreatingPost(true); }}
                  readOnly
                  className={`min-w-0 flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none cursor-pointer transition-colors ${
                    darkMode 
                      ? "bg-zinc-800/80 border border-zinc-700 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800" 
                      : "bg-gray-50 border border-gray-100 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
                  }`}
                />
                <button 
                  onClick={() => { if (requireAuth()) setIsCreatingPost(true); }}
                  className="shrink-0 bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                >
                  {t.post.createPostBtn}
                </button>
              </div>

              {selectedTag && <button className="text-sm text-blue-500" onClick={() => setSelectedTag(null)}>#{selectedTag} · Clear filter</button>}
              {activeTab === 'bookmarks' && bookmarks.isFetching && <p role="status">Loading saved posts…</p>}
              {/* Feed Content */}
              {displayedPosts.length === 0 ? (
                <div className={`rounded-2xl p-8 text-center text-sm transition-colors ${
                  darkMode ? "bg-zinc-900 text-zinc-500" : "bg-white text-gray-400"
                }`}>
                  {t.post.noPosts}
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    {...post} 
                    darkMode={darkMode}
                    language={currentLang}
                    isBookmarked={bookmarkedPostIds.includes(post.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelectPost={handleSelectPost}
                    onToggleLike={handleToggleLike}
                  />
                ))
              )}
            </div>
          )}

          {!isCreatingPost && <aside className={`rounded-2xl p-5 text-sm space-y-3 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}><h2 className="font-semibold">Community Q&amp;A</h2><p className="text-sm opacity-70 leading-relaxed">Ask a clear question, include what you have tried, and add code to help others understand the problem.</p><button className="text-sm text-blue-500" onClick={() => { if (requireAuth()) setIsCreatingPost(true); }}>Ask a question →</button></aside>}
        </div>
      </main>
    </div>
  );
}