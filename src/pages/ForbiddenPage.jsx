import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Seo from '@/Components/seo/Seo';
import Button from '@/Components/ui/button';

export default function ForbiddenPage() {
  return <main className="grid min-h-screen place-items-center bg-brand-canvas p-6 dark:bg-slate-950"><Seo title="Access denied" description="You do not have access to this page." indexable={false} /><section className="max-w-md text-center"><ShieldAlert className="mx-auto h-12 w-12 text-brand-secondary" /><h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Access denied</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">You do not have permission to access this page.</p><Button className="mt-6" asChild><Link to="/dashboard">Return to dashboard</Link></Button></section></main>;
}
