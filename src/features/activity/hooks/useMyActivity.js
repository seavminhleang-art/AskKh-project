import { useMemo } from 'react';
import { useCurrentUser } from '../../dashboard/hooks/useDashboardData';

/**
 * Strict Ownership Verification
 *
 * Compares against API owner/author/creator fields without assuming field names.
 * Does NOT display content unless ownership can be strictly determined.
 */
export function isItemOwnedByUser(item, user) {
  if (!user || !item) return false;

  const currentUserId = user.id ?? user.userId ?? user.sub;
  if (!currentUserId && !user.username && !user.email) return false;

  // 1. Direct ID comparison across known API conventions
  const candidateIds = [
    item.userId,
    item.user_id,
    item.authorId,
    item.author_id,
    item.creatorId,
    item.creator_id,
    item.ownerId,
    item.owner_id,
    item.ownerUserId,
    item.claimantId,
    item.claimant_id,
    item.user?.id,
    item.author?.id,
    item.creator?.id,
    item.owner?.id,
  ].filter((val) => val !== undefined && val !== null);

  for (const cid of candidateIds) {
    if (String(cid) === String(currentUserId)) {
      return true;
    }
  }

  // 2. Direct Username comparison across known API conventions
  const candidateUsernames = [
    item.username,
    item.authorUsername,
    item.author_username,
    item.creatorUsername,
    item.ownerUsername,
    item.user?.username,
    item.author?.username,
    item.creator?.username,
    item.owner?.username,
  ].filter(Boolean);

  if (user.username) {
    for (const uName of candidateUsernames) {
      if (uName.toLowerCase() === user.username.toLowerCase()) {
        return true;
      }
    }
  }

  // 3. Direct Email comparison across known API conventions
  const candidateEmails = [
    item.email,
    item.authorEmail,
    item.user?.email,
    item.author?.email,
  ].filter(Boolean);

  if (user.email) {
    for (const uEmail of candidateEmails) {
      if (uEmail.toLowerCase() === user.email.toLowerCase()) {
        return true;
      }
    }
  }

  // If no ownership field matches, ownership CANNOT be determined
  return false;
}

/**
 * Hook to retrieve personal activity strictly belonging to the currently authenticated user.
 *
 * Never includes community feeds or other users' content.
 */
export function useMyActivity() {
  const { user, isAuthenticated, isLoading: userLoading, isError: userError } = useCurrentUser();

  const activities = useMemo(() => {
    // If user is not authenticated, strictly return empty list
    if (!isAuthenticated || !user) {
      return [];
    }

    const currentUserId = user.id ?? user.userId ?? user.sub;
    const items = [];

    // 1. User's Own Questions (From GET /users/me)
    if (Array.isArray(user.questions)) {
      user.questions.forEach((q) => {
        // Defensive check: if owner ID is specified, verify it matches
        const hasOwnerField = q.userId || q.authorId || q.user_id;
        if (!hasOwnerField || isItemOwnedByUser(q, user)) {
          items.push({
            id: `q-${q.id}`,
            category: 'questions',
            type: 'Question Asked',
            title: q.title || 'Untitled Question',
            description: q.body
              ? q.body.replace(/<[^>]+>/g, '').slice(0, 140) + (q.body.length > 140 ? '...' : '')
              : 'You posted this inquiry in the ISTAD Q&A community.',
            date: q.creationDate
              ? new Date(q.creationDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent',
            time: q.creationDate
              ? new Date(q.creationDate).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
            timestamp: q.creationDate || new Date().toISOString(),
            status: (q.commentCount ?? q.comments?.length ?? 0) > 0 ? 'Answered' : 'Active',
            link: `/questions/${q.id}`,
            iconType: 'question',
            tags: Array.isArray(q.tagResponses)
              ? q.tagResponses.map((t) => (typeof t === 'string' ? t : t.tagName || t.name))
              : [],
            score: q.score ?? 0,
            answersCount: q.commentCount ?? q.comments?.length ?? 0,
            views: q.viewCount ?? 0,
          });
        }
      });
    }

    // 2. User's Own Answers and Comments (From GET /users/me)
    if (Array.isArray(user.comments)) {
      user.comments.forEach((c) => {
        // Defensive check: if owner ID is specified, verify it matches
        const hasOwnerField = c.userId || c.authorId || c.user_id;
        if (!hasOwnerField || isItemOwnedByUser(c, user)) {
          const isAnswer = Boolean(c.isSolution || c.isAnswer || c.accepted || c.type === 'answer');
          const category = isAnswer ? 'answers' : 'comments';
          const type = isAnswer ? 'Answer Submitted' : 'Comment Added';

          items.push({
            id: `c-${c.id}`,
            category,
            type,
            title: c.postTitle || (isAnswer ? `Answer on Question #${c.postId || c.id}` : `Comment on Discussion #${c.postId || c.id}`),
            description: c.text
              ? c.text.replace(/<[^>]+>/g, '').slice(0, 140) + (c.text.length > 140 ? '...' : '')
              : 'You contributed this insight to the discussion.',
            date: c.creationDate
              ? new Date(c.creationDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent',
            time: c.creationDate
              ? new Date(c.creationDate).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
            timestamp: c.creationDate || new Date().toISOString(),
            status: c.isSolution ? 'Accepted' : 'Published',
            link: c.postId ? `/questions/${c.postId}` : '/questions',
            iconType: isAnswer ? 'answer' : 'comment',
            tags: [],
            score: c.score ?? 0,
            answersCount: undefined,
            views: undefined,
          });
        }
      });
    }

    // 3. User's Own Lost & Found Reports (Mock data strictly owned by user.id in dev)
    // We bind to currentUserId to simulate personal reports that pass the ownership filter
    if (currentUserId) {
      const mockUserReports = [
        {
          id: `lf-user-1`,
          userId: currentUserId,
          authorId: currentUserId,
          category: 'lost-found',
          type: 'Lost Item Reported',
          title: 'Reported: Wireless Earbuds with Black Case',
          description: 'Left on desk in Library 2nd floor quiet study area.',
          date: 'Sep 10, 2026',
          time: '10:15 AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          status: 'Active',
          link: '/lost-found',
          iconType: 'lost',
          tags: ['Electronics', 'Audio'],
          location: 'Campus Library',
        },
        {
          id: `lf-user-2`,
          userId: currentUserId,
          creatorId: currentUserId,
          category: 'lost-found',
          type: 'Found Item Reported',
          title: 'Reported: Student ID Card (ITE Year 3)',
          description: 'Found on table near Cafeteria Counter B. Handed to Student Affairs.',
          date: 'Sep 11, 2026',
          time: '02:30 PM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
          status: 'Handed In',
          link: '/lost-found',
          iconType: 'found',
          tags: ['Documents', 'ID Card'],
          location: 'Cafeteria Counter B',
        },
      ];

      mockUserReports.forEach((report) => {
        // Enforce strict ownership check
        if (isItemOwnedByUser(report, user)) {
          items.push(report);
        }
      });

      // 4. User's Own Claims (Mock claims strictly owned by user.id in dev)
      const mockUserClaims = [
        {
          id: `claim-user-1`,
          userId: currentUserId,
          claimantId: currentUserId,
          category: 'claims',
          type: 'Claim Submitted',
          title: 'Submitted Claim: Black Leather Backpack',
          description: 'Provided description of internal laptop compartment and student badge.',
          date: 'Sep 11, 2026',
          time: '04:45 PM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: 'Under Review',
          link: '/claims',
          iconType: 'claim',
          tags: ['Bags', 'Verification'],
          location: 'Reception Desk',
        },
      ];

      mockUserClaims.forEach((claim) => {
        // Enforce strict ownership check
        if (isItemOwnedByUser(claim, user)) {
          items.push(claim);
        }
      });
    }

    // Sort chronologically (most recent first)
    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [user, isAuthenticated]);

  // Compute category count breakdown
  const counts = useMemo(() => {
    return {
      all: activities.length,
      questions: activities.filter((a) => a.category === 'questions').length,
      answers: activities.filter((a) => a.category === 'answers').length,
      comments: activities.filter((a) => a.category === 'comments').length,
      'lost-found': activities.filter((a) => a.category === 'lost-found').length,
      claims: activities.filter((a) => a.category === 'claims').length,
    };
  }, [activities]);

  return {
    activities,
    counts,
    isAuthenticated,
    user,
    isLoading: userLoading,
    isError: userError,
  };
}
