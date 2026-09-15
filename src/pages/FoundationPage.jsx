import React from 'react';
import { Construction } from 'lucide-react';
import Card, { CardContent } from '@/Components/ui/card';
import PageHeader from '@/Components/common/PageHeader';
import Breadcrumb from '@/Components/common/Breadcrumb';
import Seo from '@/Components/seo/Seo';

const pageCopy = {
  dashboard: ['Dashboard', 'Your community overview will appear here.'],
  activity: ['My Activity', 'Your forum and Lost & Found activity will appear here.'],
  forum: ['Community Q&A', 'Browse questions, answers, and tags.'],
  'lost-found': ['Lost & Found', 'Browse and report campus items.'],
  matches: ['Match Center', 'Review matches connected to your reports.'],
  claims: ['My Claims', 'Track the claims you have submitted.'],
  notifications: ['Notifications', 'Stay up to date with your community activity.'],
  achievements: ['Achievements', 'Your learning and community milestones will appear here.'],
  settings: ['Settings', 'Manage your profile, security, and preferences.'],
};

export default function FoundationPage({ page = 'dashboard', indexable = false }) {
  const [title, description] = pageCopy[page] || pageCopy.dashboard;
  return (
    <div className="space-y-6">
      <Seo title={title} description={description} indexable={indexable} />
      <Breadcrumb items={[{ label: title }]} />
      <PageHeader title={title} description={description} />
      <Card className="border-dashed">
        <CardContent className="flex min-h-64 flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light text-brand-primary dark:bg-[#102A56]/60 dark:text-[#B8D0F0]">
            <Construction className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Foundation ready</h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">This area is intentionally reserved for its upcoming feature implementation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
