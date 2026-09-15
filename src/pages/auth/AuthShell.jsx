import React from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';

export default function AuthShell({ title, description, children }) {
  return (
    <main className="min-h-screen bg-brand-canvas px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <Link to="/forum" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-brand-primary dark:text-[#B8D0F0]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white"><MessagesSquare className="h-5 w-5" /></span>
          ISTAD Forum
        </Link>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
