import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import Skeleton from '../Components/ui/Skeleton';

// 1. Dashboard
const DashboardPage = lazy(() => import('../pages/user/DashboardPage'));
// 2. My Activity
const ActivityPage = lazy(() => import('../pages/activity/ActivityPage'));

// 3. Q & A Community & related Q&A pages
const ForumHomePage = lazy(() => import('../pages/forum/ForumHomePage'));
const QuestionDetailPage = lazy(() => import('../pages/forum/QuestionDetailPage'));
const AskQuestionPage = lazy(() => import('../pages/forum/AskQuestionPage'));
const EditQuestionPage = lazy(() => import('../pages/forum/EditQuestionPage'));

// 4-6. Lost & Found Community & related pages
const LostFoundPage = lazy(() => import('../pages/lostFound/LostFoundPage'));
const ReportItemPage = lazy(() => import('../pages/lostFound/ReportItemPage'));
const ItemDetailPage = lazy(() => import('../pages/lostFound/ItemDetailPage'));
const EditReportPage = lazy(() => import('../pages/lostFound/EditReportPage'));
const MatchCenterPage = lazy(() => import('../pages/lostFound/MatchCenterPage'));
const MyClaimsPage = lazy(() => import('../pages/lostFound/MyClaimsPage'));

// 7-10. Workspace & Profile Pages
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'));
const AchievementsPage = lazy(() => import('../pages/achievements/AchievementsPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<UserLayout />}>
          {/* 1. Dashboard */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 2. My Activity */}
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/my-activity" element={<ActivityPage />} />

          {/* 3. Q & A Community */}
          <Route path="/questions" element={<ForumHomePage />} />
          <Route path="/forum" element={<ForumHomePage />} />
          <Route path="/qa-community" element={<ForumHomePage />} />
          <Route path="/community/questions" element={<ForumHomePage />} />
          <Route path="/forum/tag/:slug" element={<ForumHomePage />} />
          <Route path="/forum/category/:slug" element={<ForumHomePage />} />

          {/* 12. Ask Question (must precede :id to prevent capturing 'ask') */}
          <Route path="/questions/ask" element={<AskQuestionPage />} />
          <Route path="/forum/ask" element={<AskQuestionPage />} />
          <Route path="/forum/question/create" element={<AskQuestionPage />} />

          {/* 13. Edit Question */}
          <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
          <Route path="/forum/question/:id/edit" element={<EditQuestionPage />} />

          {/* 11. Q&A Question Detail */}
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/forum/question/:id" element={<QuestionDetailPage />} />
          <Route path="/community/questions/:id" element={<QuestionDetailPage />} />

          {/* 4. Lost & Found Community */}
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/lost-found-community" element={<LostFoundPage />} />

          {/* 15. Report Lost/Found (must precede :itemId to prevent capturing 'report') */}
          <Route path="/lost-found/report" element={<ReportItemPage />} />
          <Route path="/lost-found/new" element={<ReportItemPage />} />
          <Route path="/report-item" element={<ReportItemPage />} />

          {/* 5. Match Center */}
          <Route path="/matches" element={<MatchCenterPage />} />
          <Route path="/match-center" element={<MatchCenterPage />} />
          <Route path="/lost-found/matches" element={<MatchCenterPage />} />

          {/* 6. My Claims */}
          <Route path="/claims" element={<MyClaimsPage />} />
          <Route path="/my-claims" element={<MyClaimsPage />} />
          <Route path="/lost-found/claims" element={<MyClaimsPage />} />

          {/* 16. Edit Lost/Found */}
          <Route path="/lost-found/:itemId/edit" element={<EditReportPage />} />
          <Route path="/lost-found/edit/:itemId" element={<EditReportPage />} />

          {/* 14. Lost & Found Detail */}
          <Route path="/lost-found/:itemId" element={<ItemDetailPage />} />
          <Route path="/lost-found/item/:itemId" element={<ItemDetailPage />} />
          <Route path="/community/lost-found/:itemId" element={<ItemDetailPage />} />

          {/* 7. Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* 8. Achievements */}
          <Route path="/achievements" element={<AchievementsPage />} />

          {/* 9. Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />

          {/* 10. Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
