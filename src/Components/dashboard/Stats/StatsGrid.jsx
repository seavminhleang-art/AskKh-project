import React from 'react';
import { FileText, Star, CheckCircle2, Briefcase } from 'lucide-react';
import StatCard from './StatCard';

const statsData = [
  {
    id: 'my-posted',
    icon: FileText,
    title: 'My Posted',
    value: '12',
    subtitle: '10 Question • 9 Answer',
    growth: '↑ 20%',
    growthText: 'from last month',
    colorScheme: 'blue',
  },
  {
    id: 'my-reported',
    icon: Star,
    title: 'My Reported',
    value: '8',
    subtitle: '3 Lost • 5 Found',
    growth: '↑ 10%',
    growthText: 'from last month',
    colorScheme: 'amber',
  },
  {
    id: 'matches-found',
    icon: CheckCircle2,
    title: 'Matches Found',
    value: '8',
    subtitle: '5 pending • 3 resolved',
    growth: '↑ 14%',
    growthText: 'from last month',
    colorScheme: 'emerald',
  },
  {
    id: 'claims',
    icon: Briefcase,
    title: 'Claims',
    value: '4',
    subtitle: '2 in progress • 2 closed',
    growth: '↑ 33%',
    growthText: 'from last month',
    colorScheme: 'purple',
  },
];

export default function StatsGrid({ stats = statsData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          growth={stat.growth}
          growthText={stat.growthText}
          colorScheme={stat.colorScheme}
        />
      ))}
    </div>
  );
}
