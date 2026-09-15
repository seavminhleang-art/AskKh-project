import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ModerationCard({ title, meta, children, actions }) {
  return (
    <Card>
      <CardHeader className="gap-1 border-b border-slate-100 pb-4 dark:border-slate-800">
        <CardTitle className="text-base">{title}</CardTitle>
        {meta && <p className="text-lg text-slate-500 dark:text-slate-400">{meta}</p>}
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {children}
        {actions && <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">{actions}</div>}
      </CardContent>
    </Card>
  );
}
