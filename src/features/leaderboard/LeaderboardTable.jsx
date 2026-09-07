import React from 'react';
import { Trophy, ShieldCheck } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';

export default function LeaderboardTable({ users = [] }) {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-black text-sm border border-amber-300 dark:border-amber-700">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-black text-sm border border-slate-300">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-900/10 text-amber-800 dark:bg-amber-950/40 dark:text-amber-500 flex items-center justify-center font-black text-sm border border-amber-800/30">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-500">
            {rank}
          </div>
        );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">Rank</TableHead>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Badges</TableHead>
          <TableHead className="text-right">Reputation</TableHead>
          <TableHead className="text-right">Total Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell className="text-center font-bold">
              <div className="flex justify-center">{getRankBadge(index + 1)}</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.role === 'ADMIN' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-xs">{user.title}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {user.role}
              </span>
            </TableCell>
            <TableCell className="text-right font-semibold text-slate-700 dark:text-slate-300">
              {user.badgeCount || 0}
            </TableCell>
            <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
              {user.reputation}%
            </TableCell>
            <TableCell className="text-right font-extrabold text-blue-600 dark:text-blue-400 text-base">
              {user.points?.toLocaleString()} pts
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
