import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import SidebarLeft from "../miniComponent/SidebarLeft";
import PostCard from "../miniComponent/PostCard";
import CreatePostView from "../miniComponent/CreatePostView";
import DetailView from "../miniComponent/DetailView";
import Pagination from "../common/Pagination";

// Language
import { useLanguage } from "../Language/LanguageContext.jsx";
import enTranslations from "../locales/en.json";
import kmTranslations from "../locales/km.json";

// API
import {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
} from "../../features/posts/postApi";

import {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "../../features/bookmarks/bookmarkApi";

import {
  useVotePostMutation,
  useDeleteVoteMutation,
} from "../../features/votes/voteApi";

import { useUploadSingleMutation, useUploadMultipleMutation } from "../../features/upload/uploadApi";
import { uploadQuestionImages } from "../../features/qa/uploadQuestionImages";

// Helpers
import {
  rowsOf,
  savedPosts,
  mapPost,
  errorMessage,
} from "../../features/qa/model";
import { usePageSEO } from "../common/SEO";

const googleSansStyle = {
  fontFamily: '"Google Sans", sans-serif',
};

export default function QACommunity({
  darkMode: propDarkMode,
  language: propLanguage,
}) {
  usePageSEO({
    title: "Developer Q&A Community | NEXA",
    description:
      "Browse, ask, and answer programming questions with Cambodia's developer community. Find solutions for React, Spring Boot, Java, Python, and more on NEXA.",
    keywords:
      "NEXA Q&A, developer community Cambodia, programming solutions, coding questions, React Cambodia, Spring Boot, ISTAD developers",
    canonicalUrl: "https://ask-kh-project.vercel.app/community/qa",
  });
  // ==================================================
  // Context & Language
  // ==================================================

  const context = useOutletContext();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = propLanguage ?? language ?? "en";

  const t = currentLang === "km" ? kmTranslations : enTranslations;

  // ==================================================
  // Authentication
  // ==================================================

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const userId = user?.id ?? user?.userId;

  // ==================================================
  // Page State
  // ==================================================

  const [activeTab, setActiveTab] = useState("newest");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ==================================================
  // Error & Interaction State
  // ==================================================

  const [error, setError] = useState("");
  const [votes, setVotes] = useState({});

  const busy = useRef(new Set());

  // ==================================================
  // API Queries
  // ==================================================

  const feed = useGetPostsQuery();

  const bookmarks = useGetBookmarksQuery(undefined, {
    skip: !isAuthenticated,
  });

  const detail = useGetPostByIdQuery(selectedPostId, {
    skip: selectedPostId == null,
  });

  // ==================================================
  // API Mutations
  // ==================================================

  const [createPost] = useCreatePostMutation();
  const [uploadSingle] = useUploadSingleMutation();
  const [uploadMultiple] = useUploadMultipleMutation();

  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();

  const [votePost] = useVotePostMutation();
  const [deleteVote] = useDeleteVoteMutation();

  // ==================================================
  // Page Metadata
  // ==================================================

  useEffect(() => {
    document.title = "Community Q&A | NEXA";

    const description =
      "NEXA Community Q&A — ask questions, share knowledge, discuss ideas, and help other members of the community.";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);

    return () => {
      document.title = "NEXA";
    };
  }, []);

  // ==================================================
  // Saved Posts
  // ==================================================

  const saved = isAuthenticated ? savedPosts(bookmarks.data) : [];

  const bookmarkedPostIds = saved.map((post) => post.id);

  // ==================================================
  // Posts
  // ==================================================

  const posts = rowsOf(feed.data)
    .map((post) => {
      const mappedPost = mapPost(post, userId);
      const voteKey = `${userId}:${mappedPost.id}`;

      return {
        ...mappedPost,
        isLiked: Boolean(votes[voteKey]),
      };
    });

  // ==================================================
  // Authentication Helper
  // ==================================================

  const requireAuth = () => {
    if (isAuthenticated) {
      return true;
    }

    navigate("/login");
    return false;
  };

  // ==================================================
  // Cursor / Post Selection
  // ==================================================

  const handleSelectPost = (id) => {
    setSelectedPostId(id);
  };

  // ==================================================
  // Protected Async Action Helper
  // ==================================================

  const perform = async (key, action) => {
    if (!requireAuth()) {
      return;
    }

    if (busy.current.has(key)) {
      return;
    }

    busy.current.add(key);
    setError("");

    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      busy.current.delete(key);
    }
  };

  // ==================================================
  // Like / Vote
  // ==================================================

  const handleToggleLike = (postId) =>
    perform(`vote:${postId}`, async () => {
      const voteKey = `${userId}:${postId}`;

      if (votes[voteKey]) {
        await deleteVote(votes[voteKey]).unwrap();

        setVotes((previous) => ({
          ...previous,
          [voteKey]: null,
        }));

        return;
      }

      const result = await votePost({
        postId,
        voteTypeId: 1,
      }).unwrap();

      setVotes((previous) => ({
        ...previous,
        [voteKey]: result.id,
      }));
    });

  // ==================================================
  // Bookmark
  // ==================================================

  const toggleBookmark = (postId) =>
    perform(`bookmark:${postId}`, async () => {
      if (bookmarks.isFetching || bookmarks.isError) {
        throw new Error("Wait for saved posts to load, then try again.");
      }

      if (bookmarkedPostIds.includes(postId)) {
        await removeBookmark(postId).unwrap();
      } else {
        await addBookmark(postId).unwrap();
      }
    });

  // ==================================================
  // Create Post
  // ==================================================

  const handleAddPost = async ({ imageFile, ...body }) => {
    if (!isAuthenticated) {
      throw new Error("Please sign in before publishing.");
    }

    const imageUrls = imageFile
      ? await uploadQuestionImages([imageFile], uploadSingle, uploadMultiple)
      : body.imageUrls ?? [];
    await createPost({ ...body, imageUrls }).unwrap();

    setIsCreatingPost(false);
    setActiveTab("newest");
  };

  // ==================================================
  // Displayed Posts & Pagination
  // ==================================================

  const displayedPosts =
    activeTab === "bookmarks"
      ? saved.map((post) => mapPost(post, userId))
      : activeTab === "following"
        ? posts.filter((post) => post.isOwnPost)
        : [...posts]
            .filter((post) => !selectedTag || post.tags.includes(selectedTag))
            .sort(
              (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
            );

  const POSTS_PER_PAGE = 5;
  const totalPages = Math.ceil(displayedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = displayedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  // ==================================================
  // Selected Post
  // ==================================================

  const selectedPost = detail.currentData
    ? mapPost(detail.currentData, userId)
    : [...posts, ...saved.map((post) => mapPost(post, userId))].find(
        (post) => post.id === selectedPostId,
      );

  // ==================================================
  // Navigation Helpers
  // ==================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTag(null);
    setIsCreatingPost(false);
    setSelectedPostId(null);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setActiveTab("newest");
    setSelectedPostId(null);
    setIsCreatingPost(false);
    setCurrentPage(1);
  };

  const openCreatePost = () => {
    if (requireAuth()) {
      setIsCreatingPost(true);
    }
  };

  // ==================================================
  // Theme
  // ==================================================

  const pageTheme = darkMode
    ? "bg-zinc-950 text-slate-100"
    : "bg-gray-50 text-gray-900";

  // ==================================================
  // Render
  // ==================================================

  return (
    <div
      style={googleSansStyle}
      className={`shared-theme shared-page min-h-screen flex flex-col justify-between transition-colors duration-300 ${pageTheme}`}
    >
      <main className="w-full max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* ==========================================
            Error Message
        ========================================== */}

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {/* ==========================================
            Loading State
        ========================================== */}

        {feed.isLoading && (
          <p role="status" className="p-4">
            Loading posts…
          </p>
        )}

        {/* ==========================================
            Feed Error
        ========================================== */}

        {feed.isError && (
          <p role="alert" className="p-4">
            Could not load posts.{" "}
            <button
              onClick={feed.refetch}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </p>
        )}

        {/* ==========================================
            Bookmark Error
        ========================================== */}

        {activeTab === "bookmarks" && bookmarks.isError && (
          <p role="alert" className="p-4">
            Could not load bookmarks.{" "}
            <button
              onClick={bookmarks.refetch}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </p>
        )}

        {/* ==========================================
            Detail Error
        ========================================== */}

        {detail.isError && selectedPostId != null && (
          <p role="alert" className="p-4">
            Could not load post details.{" "}
            <button
              onClick={detail.refetch}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </p>
        )}

        {/* ==========================================
            Main Layout
        ========================================== */}

        <div
          className={`grid grid-cols-1 items-start gap-4 lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-6 ${
            isCreatingPost
              ? ""
              : "xl:grid-cols-[224px_minmax(0,1fr)_288px] 2xl:grid-cols-[256px_minmax(0,1fr)_288px]"
          }`}
        >
          {/* ========================================
              Left Sidebar
          ======================================== */}

          <SidebarLeft
            darkMode={darkMode}
            language={currentLang}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onSelectTag={handleTagSelect}
            savedCount={bookmarkedPostIds.length}
            posts={posts}
          />

          {/* ========================================
              Main Content
          ======================================== */}

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
              {/* ==================================
                  Create Post Trigger
              ================================== */}

              <div
                className={`flex items-center space-x-3 rounded-2xl p-2.5 transition-colors ${
                  darkMode ? "bg-zinc-900" : "bg-white"
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
                  {(user?.displayName || user?.name || "?").slice(0, 1)}
                </span>

                <input
                  type="text"
                  placeholder={t.post.placeholderInput}
                  onClick={openCreatePost}
                  readOnly
                  className={`min-w-0 flex-1 cursor-pointer rounded-xl border px-4 py-2 text-base outline-none transition-colors ${
                    darkMode
                      ? "border-zinc-700 bg-zinc-800/80 text-slate-200 placeholder-zinc-400 hover:bg-zinc-800"
                      : "border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 hover:bg-gray-100"
                  }`}
                />

                <button
                  onClick={openCreatePost}
                  className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {t.post.createPostBtn}
                </button>
              </div>

              {/* ==================================
                  Tag Filter
              ================================== */}

              {selectedTag && (
                <button
                  className="text-base text-blue-500 hover:underline"
                  onClick={() => {
                    setSelectedTag(null);
                    setCurrentPage(1);
                  }}
                >
                  #{selectedTag} · Clear filter
                </button>
              )}

              {/* ==================================
                  Bookmark Loading
              ================================== */}

              {activeTab === "bookmarks" && bookmarks.isFetching && (
                <p role="status">Loading saved posts…</p>
              )}

              {/* ==================================
                  Posts Feed
              ================================== */}

              {displayedPosts.length === 0 ? (
                <div
                  className={`rounded-2xl p-8 text-center text-base transition-colors ${
                    darkMode
                      ? "bg-zinc-900 text-zinc-500"
                      : "bg-white text-gray-400"
                  }`}
                >
                  {t.post.noPosts}
                </div>
              ) : (
                <>
                  {paginatedPosts.map((post) => (
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
                  ))}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================
              Right Sidebar
          ======================================== */}

          {!isCreatingPost && (
            <aside
              className={`space-y-3 rounded-2xl p-5 text-base ${
                darkMode ? "bg-zinc-900" : "bg-white"
              }`}
            >
              <h2 className="font-semibold">Community Q&amp;A</h2>

              <p className="text-base leading-relaxed opacity-70">
                Ask a clear question, include what you have tried, and add code
                to help others understand the problem.
              </p>

              <button
                className="text-base text-blue-500 hover:underline"
                onClick={openCreatePost}
              >
                Ask a question →
              </button>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
