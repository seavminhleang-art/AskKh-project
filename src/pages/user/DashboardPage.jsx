import React, { useMemo } from 'react';
import {
  useCurrentUser,
  useDashboardStats,
  useRecentForumActivity,
  useRecentQuestions,
  useLostFoundSummary,
  useRecentLostFoundItems,
} from '../../features/dashboard/hooks/useDashboardData';

import DashboardHeader from '../../Components/dashboard/DashboardHeader';
import DashboardStats from '../../Components/dashboard/Stats/DashboardStats';
import QuickActions from '../../Components/dashboard/QuickActions/QuickActions';
import RecentQuestions from '../../Components/dashboard/Questions/RecentQuestions';
import RecentForumActivity from '../../Components/dashboard/Activity/RecentForumActivity';
import LostFoundOverview from '../../Components/dashboard/LostFound/LostFoundOverview';
import RecentMatches from '../../Components/dashboard/Lists/RecentMatches';
import ActivityOverview from '../../Components/dashboard/Charts/ActivityOverview';
import QASummary from '../../Components/dashboard/Charts/QASummary';

export default function DashboardPage() {
  // 1. Current User Data Source (Verified OpenAPI: GET /users/me)
  const {
    user,
    isAuthenticated,
    isLoading: userLoading,
    isError: userError,
  } = useCurrentUser();

  // 2. Dashboard Stats Data Source (Real calculations + Dev Mock Lost & Found)
  const {
    stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStats();

  // 3. Recent Forum Activity Data Source (Strictly current user)
  const {
    activities,
    isLoading: activityLoading,
    isError: activityError,
    isEmpty: activityEmpty,
  } = useRecentForumActivity();

  // 4. Recent Questions Data Source (Verified OpenAPI: GET /posts)
  const {
    questions,
    isLoading: questionsLoading,
    isError: questionsError,
    isEmpty: questionsEmpty,
    refetch: refetchQuestions,
  } = useRecentQuestions();

  // 5. Lost & Found Summary Data Source (Clearly separated mock data)
  const {
    summary: lfSummary,
    isComingSoon: lfComingSoon,
    isLoading: lfSummaryLoading,
    isError: lfSummaryError,
  } = useLostFoundSummary();

  // 6. Recent Lost & Found Items Data Source (Clearly separated mock data)
  const {
    items: lfItems,
    isLoading: lfItemsLoading,
    isError: lfItemsError,
  } = useRecentLostFoundItems();

  // 7. Match Summary (Strictly user-relevant mock items when authenticated)
  const userMatches = useMemo(() => {
    if (!isAuthenticated) return [];
    return [
      {
        id: 'user-match-1',
        name: 'Wireless Bluetooth Earbuds (Black Case)',
        foundDate: 'Found Today • Library 2nd Floor',
        location: 'Campus Security Office',
        confidence: 94,
        status: 'High Match',
        time: '2h ago',
      },
      {
        id: 'user-match-2',
        name: 'Student ID Card (ITE Year 3)',
        foundDate: 'Found Yesterday • Canteen A',
        location: 'Student Affairs Reception',
        confidence: 86,
        status: 'Probable Match',
        time: '1d ago',
      },
    ];
  }, [isAuthenticated]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-8">
      {/* 1. Welcome Header */}
      <DashboardHeader
        user={user}
        isAuthenticated={isAuthenticated}
        isLoading={userLoading}
        isError={userError}
      />

      {/* 2. Top 4 Statistics Cards Row (Questions Asked, Answers Given, Lost Reports, Found Reports) */}
      <DashboardStats
        stats={stats}
        isLoading={statsLoading}
        isError={statsError}
      />

      {/* 3. Main Dashboard 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left / Main Column (8 cols on lg ~ 67%): Recent Forum, My Recent Activity, Lost & Found Overview, Activity Overview */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          {/* Section 4: Recent Forum (GET /posts) */}
          <RecentQuestions
            questions={questions}
            isLoading={questionsLoading}
            isError={questionsError}
            isEmpty={questionsEmpty}
            onRetry={refetchQuestions}
          />

          {/* Section 5: My Recent Activity (strictly user-isolated) */}
          <RecentForumActivity
            activities={activities}
            isLoading={activityLoading}
            isError={activityError}
            isEmpty={activityEmpty}
          />

          {/* Section 6: Lost & Found Overview (Lost, Found, Possible Matches, Resolved) */}
          <LostFoundOverview
            summary={lfSummary}
            items={lfItems}
            isLoading={lfSummaryLoading}
            isComingSoon={lfComingSoon}
            isError={lfSummaryError}
          />

          {/* Activity Overview (Bar Chart) */}
          <ActivityOverview />
        </div>

        {/* Right / Sidebar Column (4 cols on lg ~ 33%): Quick Actions, Match Summary, Q&A Donut Summary */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          {/* Section 3: Quick Actions (Ask Question, Report Lost, Report Found) */}
          <QuickActions />

          {/* Section 7: Match Summary (Matches related strictly to user's items) */}
          <RecentMatches
            matches={userMatches}
            isAuthenticated={isAuthenticated}
            isLoading={lfSummaryLoading}
          />

          {/* Q & A Donut Summary Chart */}
          <QASummary />
        </div>
      </div>
    </div>
  );
}

