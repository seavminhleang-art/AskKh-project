import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SidebarLeft from '../miniComponent/SidebarLeft';
import SidebarRight from '../miniComponent/SidebarRight';
import PostCard from '../miniComponent/PostCard';
import CreatePostView from '../miniComponent/CreatePostView';
import DetailView from '../miniComponent/DetailView';
import { useLanguage } from '../Language/LanguageContext.jsx';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';

import lisaAvatar from '../../assets/Website/Lisa.jpg';
import tonganAvatar from '../../assets/Website/Tong An.jpg';

const googleSansStyle = {
  fontFamily: '"Google Sans", sans-serif'
};

export default function QACommunity({ darkMode: propDarkMode, language: propLanguage }) {
  const context = useOutletContext();
  const { language } = useLanguage();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = propLanguage ?? language ?? 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;
  const postT = t?.post || {
    placeholderInput: currentLang === 'km' ? 'តើអ្នកកំពុងគិតអ្វី?' : "What's on your mind?",
    createPostBtn: currentLang === 'km' ? 'បង្កើតអត្ថបទ' : 'Create Post',
    noPosts: currentLang === 'km' ? 'មិនរកឃើញអត្ថបទទេ' : 'No posts found.'
  };

  const [activeTab, setActiveTab] = useState('newest');
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How you patch KDE on FreeBSD depends on whether you mean updating to the latest KDE packages or applying a custom different patch file to a specific KDE port component.",
      tags: ["linux", "freebsd", "patching"],
      author: { name: "Mom Lisa", avatar: lisaAvatar, time: "3days ago" },
      views: "651,324", likes: "36,645", comments: 0,
      image: "https://picsum.photos/300/200?random=1",
      isOwnPost: true
    },
    {
      id: 2,
      title: "I am building a high-throughput collaborative app where multiple users can upvote, edit items, and change tags simultaneously. When performing optimistic updates with `useMutation` onQueryStarted...",
      tags: ["react", "typescript", "vite"],
      author: { name: "Tong An", avatar: tonganAvatar, time: "3days ago" },
      views: "244,564", likes: "10,920", comments: 3,
      image: "https://picsum.photos/300/200?random=2",
      isOwnPost: false
    }
  ]);

  const toggleBookmark = (id) => {
    setBookmarkedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    setBookmarkedPostIds((prev) => prev.filter((itemId) => itemId !== id));
    if (selectedPostId === id) setSelectedPostId(null);
  };

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
    setActiveTab('newest');
  };

  const displayedPosts = activeTab === 'bookmarks' 
    ? posts.filter(post => bookmarkedPostIds.includes(post.id))
    : activeTab === 'following'
    ? posts.filter(post => post.isOwnPost)
    : posts;

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div 
      style={googleSansStyle} 
      className={`shared-page min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <main className="max-w-7xl w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
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
            <div className="flex-1 space-y-4">
              {/* Post Trigger Input */}
              <div className={`rounded-2xl p-2.5 border shadow-sm flex items-center space-x-3 transition-colors ${
                darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
              }`}>
                <img src={lisaAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                <input 
                  type="text" 
                  placeholder={postT.placeholderInput}
                  onClick={() => setIsCreatingPost(true)}
                  readOnly
                  className={`flex-1 rounded-xl px-4 py-2 text-xs focus:outline-none cursor-pointer transition-colors ${
                    darkMode 
                      ? "bg-zinc-800/80 border border-zinc-700 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800" 
                      : "bg-gray-50 border border-gray-100 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {postT.createPostBtn}
                </button>
              </div>

              {/* Feed Content */}
              {displayedPosts.length === 0 ? (
                <div className={`rounded-2xl p-8 border text-center text-xs transition-colors ${
                  darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-gray-100 text-gray-400"
                }`}>
                  {postT.noPosts}
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
                    onSelectPost={setSelectedPostId}
                    onDeletePost={handleDeletePost}
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
