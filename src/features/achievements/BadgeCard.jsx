import React from 'react';
import {
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Search,
  Award,
  Shield,
  Zap,
  Star,
  Lock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { BADGE_TIERS } from '../../constants';

export default function BadgeCard({ achievement }) {
  const iconMap = {
    HelpCircle,
    ThumbsUp,
    MessageSquare,
    Search,
    Award,
    Shield,
    Zap,
    Star,
  };

  const IconComponent = iconMap[achievement.icon] || Award;
  const tierConfig = BADGE_TIERS[achievement.tier] || BADGE_TIERS.BRONZE;

  return (
    <Card
      className={`p-5 relative overflow-hidden transition-all ${
        achievement.unlocked
          ? 'border-slate-200/80 dark:border-slate-800'
          : 'opacity-70 bg-slate-50/50 dark:bg-slate-900/40 border-dashed'
      }`}
      hover={achievement.unlocked}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
            achievement.unlocked
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
          }`}
        >
          {achievement.unlocked ? (
            <IconComponent className="w-6 h-6" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${tierConfig.color}`}
        >
          {achievement.tier}
        </span>
      </div>

      <div className="space-y-1.5">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
          {achievement.description}
        </p>
      </div>

      {achievement.unlocked ? (
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            +{achievement.points} Points Earned
          </span>
          <span className="text-slate-400">Unlocked</span>
        </div>
      ) : (
        <div className="space-y-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Progress</span>
            <span className="font-bold">
              {achievement.progress} / {achievement.totalRequired}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.round(
                  (achievement.progress / achievement.totalRequired) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
