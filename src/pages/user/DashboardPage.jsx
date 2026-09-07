import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/Stats/StatsGrid';
import ActivityOverview from '../../components/dashboard/Charts/ActivityOverview';
import QASummary from '../../components/dashboard/Charts/QASummary';
import RecentReports from '../../components/dashboard/Tables/RecentReports';
import RecentMatches from '../../components/dashboard/Lists/RecentMatches';
import CategoryBreakdown from '../../components/dashboard/Charts/CategoryBreakdown';

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header with Greeting */}
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Sovannrith! Here's what's happening today."
      />

      {/* 2. 4 Horizontal Statistic Cards */}
      <StatsGrid />

      {/* 3. Activity Overview (Left Wider) & Q&A Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <ActivityOverview />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <QASummary />
        </div>
      </div>

      {/* 4. Recent Reports Table (Left Wider) & Recent Matches + Categories (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-8">
          <RecentReports />
        </div>
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          <RecentMatches />
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );
}
