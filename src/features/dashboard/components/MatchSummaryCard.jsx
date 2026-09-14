import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MatchCenterCard({ isLoading, isError, summary, topMatch }) {
  return (
    <Card className="bg-gray-850 border-gray-800 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-title font-bold text-gray-100">Match Center</CardTitle>
        <Sparkles className="w-5 h-5 text-brand-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-12 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-800" />
            <Skeleton className="h-20 w-full bg-gray-800 rounded-lg" />
          </>
        ) : isError ? (
          <p className="text-body text-brand-secondary">Couldn't load matches — try again.</p>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-100">{summary?.total ?? 0}</div>
            <p className="text-body text-gray-400">
              Possible matches need your review.
            </p>

            {topMatch && (
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="font-semibold text-gray-100">{topMatch.reportTitle}</p>
                <p className="text-sm text-brand-accent mt-1">
                  {Math.round((topMatch.totalScore ?? 0) * 100)}% match
                </p>
              </div>
            )}

            <Link
              to="/match-center"
              className="inline-flex items-center gap-1 text-brand-primary text-sm font-medium underline"
            >
              Review matches <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}