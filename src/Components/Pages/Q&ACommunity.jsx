import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SidebarLeft from '../miniComponent/SidebarLeft';
import SidebarRight from '../miniComponent/SidebarRight';
import PostCard from '../miniComponent/PostCard';
import CreatePostView from '../miniComponent/CreatePostView';
import DetailView from '../miniComponent/DetailView';
import { useLanguage } from '../Language/LanguageContext.jsx';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';
import {
  useGetPostsQuery,
  useGetPostByIdQuery,
} from '../../features/posts/postApi';
import {
  useVotePostMutation,
} from '../../features/votes/voteApi';
import {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from '../../features/bookmarks/bookmarkApi';

const googleSansStyle = {
  fontFamily: '"Google Sans",sans-serif'
};

export default function QACommunity({ darkMode: propDarkMode, language: propLanguage }) {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = propLanguage ?? language ?? 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('newest');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Live queries
  const { data: apiPosts = [], isLoading, isError, refetch } = useGetPostsQuery();
  const { data: bookmarksData, refetch: refetchBookmarks } = useGetBookmarksQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [votePostMutation] = useVotePostMutation();
  const [addBookmarkMutation] = useAddBookmarkMutation();
  const [removeBookmarkMutation] = useRemoveBookmarkMutation();

  const bookmarkedPostIds = bookmarksData?.bookMarkList?.map((p) => p.id) || [];

  // Handle post selection
  const handleSelectPost = (id) => {
    setSelectedPostId(id);
  };

  // Toggle post like/upvote via live API
  const handleToggleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.info('Please log in to upvote posts');
      navigate('/login');
      return;
    }
    try {
      await votePostMutation({ postId, voteTypeId: 1 }).unwrap();
      refetch();
    } catch (err) {
      console.error('Vote failed:', err);
      toast.error(err?.data?.message || 'Vote action failed');
    }
  };

  // Toggle bookmark via live API
  const handleToggleBookmark = async (postId) => {
    if (!isAuthenticated) {
      toast.info('Please log in to bookmark discussions');
      navigate('/login');
      return;
    }
    const isBookmarked = bookmarkedPostIds.includes(postId);
    try {
      if (isBookmarked) {
        await removeBookmarkMutation({ postIds: [postId] }).unwrap();
        toast.info('Removed from bookmarks');
      } else {
        await addBookmarkMutation({ postIds: [postId] }).unwrap();
        toast.success('Saved to bookmarks');
      }
      refetchBookmarks();
    } catch (err) {
      console.error('Bookmark error:', err);
      toast.error(err?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleAddPost = (newPost) => {
    setIsCreatingPost(false);
    setActiveTab('newest');
    refetch();
  };

  // Filter posts based on activeTab
  const displayedPosts = Array.isArray(apiPosts)
    ? apiPosts.filter((post) => {
        if (activeTab === 'bookmarks') {
          return bookmarkedPostIds.includes(post.id);
        }
        if (activeTab === 'following' || activeTab === 'yourPost') {
          return post.ownerId === user?.id || post.ownerDisplayName === user?.displayName;
        }
        return true; // 'newest'
      })
    : [];

  const selectedPost = apiPosts.find((p) => p.id === selectedPostId);

  return (
    <div 
      style={googleSansStyle} 
      className={`shared-theme shared-page min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid grid-cols-1 items-start gap-4 lg:gap-6 lg:grid-cols-[224px_minmax(0,1fr)] ${isCreatingPost ? "" : "xl:grid-cols-[224px_minmax(0,1fr)_288px] 2xl:grid-cols-[256px_minmax(0,1fr)_288px]"}`}>
          <SidebarLeft
            darkMode={darkMode}
            language={currentLang}
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsCreatingPost(false);
              setSelectedPostId(null);
            }} 
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
            />
          ) : (
            <div className="min-w-0 space-y-4">
              {/* Post Trigger Input */}
              <div className={`rounded-2xl p-2.5 flex items-center space-x-3 transition-colors ${
                darkMode ? "bg-zinc-900" : "bg-white"
              }`}>
                <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {(user?.displayName || 'U').charAt(0).toUpperCase()}
                </div>
                <input 
                  type="text" 
                  placeholder={t.post?.placeholderInput || "What is your question?"}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('Please log in to ask a question');
                      navigate('/login');
                      return;
                    }
                    setIsCreatingPost(true);
                  }}
                  readOnly
                  className={`min-w-0 flex-1 rounded-xl px-4 py-2 text-xs focus:outline-none cursor-pointer transition-colors ${
                    darkMode 
                      ? "bg-zinc-800/80 border border-zinc-700 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800" 
                      : "bg-gray-50 border border-gray-100 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
                  }`}
                />
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('Please log in to ask a question');
                      navigate('/login');
                      return;
                    }
                    setIsCreatingPost(true);
                  }}
                  className="shrink-0 bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors"
                >
                  {t.post?.createPostBtn || "Ask Question"}
                </button>
              </div>

              {/* Feed Content Loading / Error / List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`animate-pulse rounded-2xl p-5 flex gap-4 ${
                        darkMode ? "bg-zinc-900" : "bg-white"
                      }`}
                    >
                      <div className="w-28 h-28 bg-gray-300 dark:bg-zinc-800 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-3/4 bg-gray-300 dark:bg-zinc-800 rounded" />
                        <div className="h-3.5 w-full bg-gray-200 dark:bg-zinc-800/80 rounded" />
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-zinc-800/80 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className={`rounded-2xl p-8 text-center text-xs border transition-colors ${
                  darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-gray-100 text-gray-500"
                }`}>
                  <p className="mb-3">Unable to load community posts right now.</p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : displayedPosts.length === 0 ? (
                <div className={`rounded-2xl p-8 text-center text-xs border transition-colors ${
                  darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-gray-100 text-gray-400"
                }`}>
                  {activeTab === 'bookmarks'
                    ? 'You have not saved any bookmarks yet.'
                    : activeTab === 'following'
                    ? 'You have not posted any questions yet.'
                    : t.post?.noPosts || 'No discussions available yet.'}
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    {...post} 
                    darkMode={darkMode}
                    language={currentLang}
                    isBookmarked={bookmarkedPostIds.includes(post.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectPost={handleSelectPost}
                    onToggleLike={handleToggleLike}
                  />
                ))
              )}
            </div>
          )}

          {!isCreatingPost && <SidebarRight darkMode={darkMode} language={currentLang} />}
        </div>
      </main>
    </div>
  );
}