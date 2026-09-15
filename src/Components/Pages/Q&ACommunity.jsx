// import React, { useState } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import SidebarLeft from '../miniComponent/SidebarLeft';
// import SidebarRight from '../miniComponent/SidebarRight';
// import PostCard from '../miniComponent/PostCard';
// import CreatePostView from '../miniComponent/CreatePostView';
// import DetailView from '../miniComponent/DetailView';
// import { useLanguage } from '../Language/LanguageContext.jsx';
// import enTranslations from '../locales/en.json';
// import kmTranslations from '../locales/km.json';

// const googleSansStyle = {
//   fontFamily: '"Google Sans",sans-serif'
// };

// export default function QACommunity({ darkMode: propDarkMode, language: propLanguage }) {
//   const context = useOutletContext();
//   const { language } = useLanguage();
//   const darkMode = propDarkMode ?? context?.darkMode ?? false;
//   const currentLang = propLanguage ?? language ?? 'en';

//   const t = currentLang === 'km' ? kmTranslations : enTranslations;

//   const [activeTab, setActiveTab] = useState('following');
//   const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [isCreatingPost, setIsCreatingPost] = useState(false);

//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       title: "How you patch KDE on FreeBSD depends on whether you mean updating to the latest KDE packages or applying a custom different patch file to a specific KDE port component.",
//       tags: ["linux", "freebsd", "patching"],
//       author: { name: "Mom Lisa", avatar: "../../src/assets/Website/Lisa.jpg", time: "3days ago" },
//       views: 651324, 
//       likes: 36645, 
//       isLiked: false, 
//       comments: [
//         {
//           id: 101,
//           text: "Very helpful guide!",
//           author: { name: "Tong An", avatar: "../../src/assets/Website/Tong An.jpg", time: "2 days ago" },
//           likes: 5,
//           isLiked: false,
//           isOwnComment: false
//         }
//       ],
//       image: "https://picsum.photos/300/200?random=1",
//       isOwnPost: true
//     },
//     {
//       id: 2,
//       title: "I am building a high-throughput collaborative app where multiple users can upvote, edit items, and change tags simultaneously.",
//       tags: ["react", "typescript", "vite"],
//       author: { name: "Tong An", avatar: "../../src/assets/Website/Tong An.jpg", time: "3days ago" },
//       views: 244564, 
//       likes: 10920, 
//       isLiked: false, 
//       comments: [],
//       image: "https://picsum.photos/300/200?random=2",
//       isOwnPost: false
//     }
//   ]);

//   // Handle post selection & auto-increment views (+1)
//   const handleSelectPost = (id) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === id ? { ...post, views: post.views + 1 } : post
//       )
//     );
//     setSelectedPostId(id);
//   };

//   // Toggle post like (+1 / -1 loop)
//   const handleToggleLike = (id) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.id === id) {
//           const isLiked = post.isLiked;
//           return {
//             ...post,
//             isLiked: !isLiked,
//             likes: isLiked ? post.likes - 1 : post.likes + 1
//           };
//         }
//         return post;
//       })
//     );
//   };

//   // Handle updating post comments directly from DetailView
//   const handleUpdateComments = (postId, updatedComments) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === postId ? { ...post, comments: updatedComments } : post
//       )
//     );
//   };

//   const toggleBookmark = (id) => {
//     setBookmarkedPostIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleDeletePost = (id) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//     setBookmarkedPostIds((prev) => prev.filter((itemId) => itemId !== id));
//     if (selectedPostId === id) setSelectedPostId(null);
//   };

//   const handleAddPost = (newPost) => {
//     setPosts([newPost, ...posts]);
//     setIsCreatingPost(false);
//     setActiveTab('following');
//   };

//   const displayedPosts = activeTab === 'bookmarks' 
//     ? posts.filter(post => bookmarkedPostIds.includes(post.id))
//     : activeTab === 'following'
//     ? posts.filter(post => post.isOwnPost)
//     : posts;

//   const selectedPost = posts.find(p => p.id === selectedPostId);

//   return (
//     <div 
//       style={googleSansStyle} 
//       className={`shared-page min-h-screen flex flex-col justify-between transition-colors duration-300 ${
//         darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       <main className="max-w-7xl w-full mx-auto px-4 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           <SidebarLeft
//             darkMode={darkMode}
//             language={currentLang}
//             activeTab={activeTab} 
//             setActiveTab={(tab) => {
//               setActiveTab(tab);
//               setIsCreatingPost(false);
//               setSelectedPostId(null);
//             }} 
//             savedCount={bookmarkedPostIds.length} 
//           />

//           {isCreatingPost ? (
//             <CreatePostView 
//               darkMode={darkMode}
//               language={currentLang}
//               onAddPost={handleAddPost} 
//               onCancel={() => setIsCreatingPost(false)} 
//             />
//           ) : selectedPost ? (
//             <DetailView 
//               darkMode={darkMode}
//               language={currentLang}
//               post={selectedPost} 
//               onBack={() => setSelectedPostId(null)}
//               onUpdateComments={(updatedComments) => handleUpdateComments(selectedPost.id, updatedComments)}
//             />
//           ) : (
//             <div className="flex-1 space-y-4">
//               <div className={`rounded-2xl p-2.5 border shadow-sm flex items-center space-x-3 transition-colors ${
//                 darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
//               }`}>
//                 <img src="../../src/assets/Website/Lisa.jpg" alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
//                 <input 
//                   type="text" 
//                   placeholder={t.post.placeholderInput}
//                   onClick={() => setIsCreatingPost(true)}
//                   readOnly
//                   className={`flex-1 rounded-xl px-4 py-2 text-xs focus:outline-none cursor-pointer transition-colors ${
//                     darkMode 
//                       ? "bg-zinc-800/80 border border-zinc-700 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800" 
//                       : "bg-gray-50 border border-gray-100 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
//                   }`}
//                 />
//                 <button 
//                   onClick={() => setIsCreatingPost(true)}
//                   className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-xs"
//                 >
//                   {t.post.createPostBtn}
//                 </button>
//               </div>

//               {displayedPosts.length === 0 ? (
//                 <div className={`rounded-2xl p-8 border text-center text-xs transition-colors ${
//                   darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-gray-100 text-gray-400"
//                 }`}>
//                   {t.post.noPosts}
//                 </div>
//               ) : (
//                 displayedPosts.map((post) => (
//                   <PostCard 
//                     key={post.id} 
//                     {...post} 
//                     darkMode={darkMode}
//                     language={currentLang}
//                     isBookmarked={bookmarkedPostIds.includes(post.id)}
//                     onToggleBookmark={toggleBookmark}
//                     onSelectPost={handleSelectPost}
//                     onToggleLike={handleToggleLike}
//                     onDeletePost={handleDeletePost}
//                   />
//                 ))
//               )}
//             </div>
//           )}

//           {!isCreatingPost && <SidebarRight darkMode={darkMode} language={currentLang} />}
//         </div>
//       </main>
//     </div>
//   );
// }










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

const googleSansStyle = {
  fontFamily: '"Google Sans",sans-serif'
};

export default function QACommunity({ darkMode: propDarkMode, language: propLanguage }) {
  const context = useOutletContext();
  const { language } = useLanguage();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = propLanguage ?? language ?? 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;

  const [activeTab, setActiveTab] = useState('following');
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How you patch KDE on FreeBSD depends on whether you mean updating to the latest KDE packages or applying a custom different patch file to a specific KDE port component.",
      tags: ["linux", "freebsd", "patching"],
      author: { name: "Mom Lisa", avatar: "../../src/assets/Website/Lisa.jpg", time: "3days ago" },
      views: 651324, 
      likes: 36645, 
      isLiked: false, 
      comments: [
        {
          id: 101,
          text: "Very helpful guide!",
          author: { name: "Tong An", avatar: "../../src/assets/Website/Tong An.jpg", time: "2 days ago" },
          likes: 5,
          isLiked: false,
          isOwnComment: false
        }
      ],
      image: "https://picsum.photos/300/200?random=1",
      isOwnPost: true
    },
    {
      id: 2,
      title: "I am building a high-throughput collaborative app where multiple users can upvote, edit items, and change tags simultaneously. When performing optimistic updates with `useMutation` onQueryStarted...",
      tags: ["react", "typescript", "vite"],
      author: { name: "Tong An", avatar: "../../src/assets/Website/Tong An.jpg", time: "3days ago" },
      views: 244564, 
      likes: 10920, 
      isLiked: false, 
      comments: [],
      image: "https://picsum.photos/300/200?random=2",
      isOwnPost: false
    }
  ]);

  // Fix: Convert views value to a number before adding 1 to prevent string concatenation ("0" + 1 => "01")
  const handleSelectPost = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          const currentViews = typeof post.views === 'string' 
            ? parseInt(post.views.replace(/,/g, ''), 10) || 0 
            : Number(post.views || 0);
          return { ...post, views: currentViews + 1 };
        }
        return post;
      })
    );
    setSelectedPostId(id);
  };

  const handleToggleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          const isLiked = post.isLiked;
          const currentLikes = typeof post.likes === 'string'
            ? parseInt(post.likes.replace(/,/g, ''), 10) || 0
            : Number(post.likes || 0);
          return {
            ...post,
            isLiked: !isLiked,
            likes: isLiked ? currentLikes - 1 : currentLikes + 1
          };
        }
        return post;
      })
    );
  };

  const handleUpdateComments = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };

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
    // Ensure new posts store views/likes as numbers
    const formattedPost = {
      ...newPost,
      views: Number(newPost.views || 0),
      likes: Number(newPost.likes || 0)
    };
    setPosts([formattedPost, ...posts]);
    setIsCreatingPost(false);
    setActiveTab('following');
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
              onUpdateComments={(updatedComments) => handleUpdateComments(selectedPost.id, updatedComments)}
            />
          ) : (
            <div className="flex-1 space-y-4">
              {/* Post Trigger Input */}
              <div className={`rounded-2xl p-2.5 border shadow-sm flex items-center space-x-3 transition-colors ${
                darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
              }`}>
                <img src="../../src/assets/Website/Lisa.jpg" alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                <input 
                  type="text" 
                  placeholder={t.post.placeholderInput}
                  onClick={() => setIsCreatingPost(true)}
                  readOnly
                  className={`flex-1 rounded-xl px-4 py-2 text-xs focus:outline-none cursor-pointer transition-colors ${
                    darkMode 
                      ? "bg-zinc-800/80 border border-zinc-700 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800" 
                      : "bg-gray-50 border border-gray-100 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
                  }`}
                />
                <button 
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {t.post.createPostBtn}
                </button>
              </div>

              {/* Feed Content */}
              {displayedPosts.length === 0 ? (
                <div className={`rounded-2xl p-8 border text-center text-xs transition-colors ${
                  darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-gray-100 text-gray-400"
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