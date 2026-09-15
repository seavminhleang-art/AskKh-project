import { useMemo } from 'react';
import { useAppSelector } from '../../../hooks/useAppStore';
import {
  useGetMeQuery,
  useGetNotificationsQuery,
  useGetRecentPostsQuery,
} from '../dashboardApi';
import { lostFoundService } from '../../lostFound/services/lostFoundService';
import { transformDashboardStats } from '../services/dashboardStatsTransformer';

/**
 * 1. Current User Data Source
 * Verified OpenAPI: GET /users/me
 */
export function useCurrentUser() {
  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth);
  const {
    data: meData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = useMemo(() => {
    if (!isAuthenticated) return null;
    return meData || authUser || null;
  }, [isAuthenticated, meData, authUser]);

  return {
    user,
    isAuthenticated,
    isLoading: isAuthenticated && (isLoading || (isFetching && !user)),
    isError,
    error,
    refetch,
  };
}

/**
 * 2. Dashboard Statistics Data Source
 * Real Dashboard statistics calculated from supported OpenAPI resources:
 * - Questions Asked  <- GET /users/me (user.questions.length)
 * - Answers Given    <- GET /users/me (user.comments.length)
 * - Lost Reports     <- Handled gracefully via lostFoundService (Coming Soon)
 * - Found Reports    <- Handled gracefully via lostFoundService (Coming Soon)
 */
export function useDashboardStats() {
  const { user, isAuthenticated, isLoading: userLoading, isError: userError } = useCurrentUser();

  const isError = Boolean(userError);
  const isLoading = Boolean(isAuthenticated && userLoading);

  const stats = useMemo(() => {
    return transformDashboardStats({
      user,
      reports: null, // Lost & Found backend unavailable; transformer displays '--' Coming Soon
      isAuthenticated,
      isError,
    });
  }, [user, isAuthenticated, isError]);

  return {
    stats,
    isLoading,
    isError,
  };
}

/**
 * 3. Recent Forum Activity Data Source
 * Derived from user's questions, comments, and notifications
 */
export function useRecentForumActivity() {
  const { user, isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const { data: notifData, isLoading: notifLoading, isError: notifError } = useGetNotificationsQuery(
    { page: 0, size: 6 },
    { skip: !isAuthenticated }
  );

  const activities = useMemo(() => {
    if (!isAuthenticated) return [];

    const items = [];

    // User's own questions
    (user?.questions || []).forEach((q) => {
      items.push({
        id: `q-${q.id}`,
        questionId: q.id,
        type: 'question',
        activityType: 'You asked this question',
        title: q.title || 'Untitled Question',
        to: `/forum/question/${q.id}`,
        timestamp: q.creationDate || new Date().toISOString(),
        tags: Array.isArray(q.tagResponses)
          ? q.tagResponses.map((t) => (typeof t === 'string' ? t : t.tagName || t.name))
          : [],
        votes: q.score ?? 0,
        answersCount: Array.isArray(q.comments) ? q.comments.length : (q.commentCount ?? 0),
        badge: 'Q&A',
      });
    });

    // User's own comments
    (user?.comments || []).forEach((c) => {
      items.push({
        id: `c-${c.id}`,
        questionId: c.postId || c.questionId,
        type: 'comment',
        activityType: 'You commented on a question',
        title: c.postTitle || c.title || (c.text ? (c.text.length > 70 ? `${c.text.substring(0, 70)}...` : c.text) : 'Contributed to a discussion'),
        to: c.postId ? `/forum/question/${c.postId}` : '/forum',
        timestamp: c.creationDate || new Date().toISOString(),
        tags: [],
        votes: c.score ?? 0,
        answersCount: undefined,
        badge: 'Comment',
      });
    });

    // Recent notifications if relevant
    (notifData?.content || []).forEach((n) => {
      items.push({
        id: `notif-${n.id}`,
        questionId: n.targetId || n.referenceId,
        type: 'notification',
        activityType: n.title || 'Notification',
        title: n.body || 'Activity update',
        to: n.targetUrl || '/my-activity',
        timestamp: n.createdAt || new Date().toISOString(),
        tags: [],
        votes: undefined,
        answersCount: undefined,
        badge: 'Update',
      });
    });

    return items
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6);
  }, [user, notifData, isAuthenticated]);

  return {
    activities,
    isLoading: isAuthenticated && (userLoading || notifLoading),
    isError: notifError,
    isEmpty: !isAuthenticated || activities.length === 0,
  };
}

/**
 * 4. Recent Questions Data Source
 * Verified OpenAPI: GET /posts
 */
export function useRecentQuestions() {
  const { data: rawPosts, isLoading, isError, refetch } = useGetRecentPostsQuery();

  const questions = useMemo(() => {
    if (!Array.isArray(rawPosts)) return [];

    return rawPosts
      .slice()
      .sort((a, b) => new Date(b.creationDate || 0) - new Date(a.creationDate || 0))
      .slice(0, 5)
      .map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        score: post.score ?? 0,
        views: post.viewCount ?? 0,
        answersCount: Array.isArray(post.comments) ? post.comments.length : (post.commentCount ?? 0),
        author: post.ownerDisplayName || 'ISTAD Member',
        creationDate: post.creationDate || new Date().toISOString(),
        tags: Array.isArray(post.tagResponses)
          ? post.tagResponses.map((t) => (typeof t === 'string' ? t : t.tagName || t.name))
          : [],
      }));
  }, [rawPosts]);

  return {
    questions,
    isLoading,
    isError,
    isEmpty: questions.length === 0,
    refetch,
  };
}


/**
 * 5. Lost & Found Summary Data Source
 * Architecture:
 * Backend API (when deployed) -> lostFoundService -> useLostFoundSummary -> LostFoundOverview
 *
 * Current status: Backend endpoints are not yet deployed.
 * Clearly separated mock data for development visualization without faking network calls.
 */
export function useLostFoundSummary() {
  const isAvailable = lostFoundService.isServiceAvailable;

  const summary = useMemo(() => {
    // Clearly separated mock data for visualization
    return {
      total: 38,
      lost: 15,
      found: 23,
      activeLost: 8,
      activeFound: 14,
      possibleMatches: 5,
      resolved: 19,
      categoryBreakdown: [
        { name: 'Electronics', count: 14, percentage: 37 },
        { name: 'Wallets & IDs', count: 10, percentage: 26 },
        { name: 'Books & Notes', count: 8, percentage: 21 },
        { name: 'Personal Belongings', count: 6, percentage: 16 },
      ],
    };
  }, []);

  return {
    summary,
    isAvailable,
    isComingSoon: !isAvailable,
    message: lostFoundService.statusMessage,
    isLoading: false,
    isError: false,
  };
}

/**
 * 6. Recent Lost & Found Items Data Source
 * Architecture:
 * Backend API (when deployed) -> lostFoundService -> useRecentLostFoundItems -> RecentLostFound
 */
export function useRecentLostFoundItems() {
  const isAvailable = lostFoundService.isServiceAvailable;

  const items = useMemo(() => {
    // Clearly separated mock data for development visualization
    return [
      {
        id: 'lf-mock-1',
        title: 'MacBook Air M2 Silver',
        itemType: 'FOUND',
        location: 'Library 2nd Floor Study Room',
        date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        status: 'ACTIVE',
        category: 'Electronics',
        isMock: true,
      },
      {
        id: 'lf-mock-2',
        title: 'Navy Blue Leather Wallet',
        itemType: 'LOST',
        location: 'Building A Canteen',
        date: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        status: 'ACTIVE',
        category: 'Personal Belongings',
        isMock: true,
      },
      {
        id: 'lf-mock-3',
        title: 'Student ID Card (ITE Year 3)',
        itemType: 'FOUND',
        location: 'Lab 304',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        status: 'RESOLVED',
        category: 'Documents',
        isMock: true,
      },
    ];
  }, []);

  return {
    items,
    isAvailable,
    isComingSoon: !isAvailable,
    message: lostFoundService.statusMessage,
    isLoading: false,
    isError: false,
    isEmpty: items.length === 0,
  };
}

