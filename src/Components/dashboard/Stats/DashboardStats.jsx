import React from 'react';
import { HelpCircle, CheckCircle2, FileQuestion, PackageCheck } from 'lucide-react';
import StatCard from './StatCard';
import { useLanguage } from '../../../hooks/useLanguage';

export default function DashboardStats({
  stats,
  isLoading = false,
  isError = false,
}) {
  const { t } = useLanguage();

  // 1. Loading State: Render 4 skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCard key={i} isLoading={true} />
        ))}
      </div>
    );
  }

  // 2. Transformed State: Map existing data to the 4 required reference cards
  const statList = Array.isArray(stats) ? stats : [];
  const qStat = statList.find((s) => s.id === 'questions-asked') || statList[0];
  const aStat = statList.find((s) => s.id === 'answers-given') || statList[1];
  const lStat = statList.find((s) => s.id === 'lost-reports') || statList[2];
  const fStat = statList.find((s) => s.id === 'found-reports') || statList[3];

  const cards = [
    {
      id: 'questions-asked',
      title: t('dashboard.questionsAsked'),
      value: qStat?.value ?? '--',
      subtitle: qStat?.subtitle || t('qa.questions'),
      growth: qStat?.growth || 'Q&A',
      growthText: qStat?.growthText || 'forum activity',
      colorScheme: 'blue',
      icon: HelpCircle,
      isMock: false,
    },
    {
      id: 'answers-given',
      title: t('dashboard.answersGiven'),
      value: aStat?.value ?? '--',
      subtitle: aStat?.subtitle || t('qa.answers'),
      growth: aStat?.growth || 'Community',
      growthText: aStat?.growthText || 'helpful solutions',
      colorScheme: 'emerald',
      icon: CheckCircle2,
      isMock: false,
    },
    {
      id: 'lost-reports',
      title: t('dashboard.lostReports'),
      value: lStat?.value ?? '--',
      subtitle: lStat?.subtitle || t('lostFound.lost'),
      growth: lStat?.growth || 'Campus',
      growthText: lStat?.growthText || 'in development',
      colorScheme: 'rose',
      icon: FileQuestion,
      isMock: true,
    },
    {
      id: 'found-reports',
      title: t('dashboard.foundReports'),
      value: fStat?.value ?? '--',
      subtitle: fStat?.subtitle || t('lostFound.found'),
      growth: fStat?.growth || 'Campus',
      growthText: fStat?.growthText || 'in development',
      colorScheme: 'amber',
      icon: PackageCheck,
      isMock: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          growth={card.growth}
          growthText={card.growthText}
          colorScheme={card.colorScheme}
          isMock={card.isMock}
          isError={isError}
        />
      ))}
    </div>
  );
}
