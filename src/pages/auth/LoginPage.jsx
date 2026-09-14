import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLoginMutation } from '@/features/auth/authApi';
import AuthShell from './AuthShell';
import Button from '@/Components/ui/button';
import Input from '@/Components/ui/Input';
import Alert from '@/Components/ui/Alert';
import Seo from '@/Components/seo/Seo';

function errorMessage(error) {
  if (error?.status === 401) return 'Email or password is incorrect.';
  if (error?.status === 403) return 'This account is not permitted to sign in.';
  return 'We could not sign you in. Please try again.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading, error }] = useLoginMutation();
  const [values, setValues] = useState({ email: '', password: '' });
  const from = location.state?.from || '/dashboard';

  async function onSubmit(event) {
    event.preventDefault();
    try {
      await login(values).unwrap();
      toast.success('Signed in successfully.');
      navigate(from, { replace: true });
    } catch {
      // The API error is rendered below with an accessible alert.
    }
  }

  return <AuthShell title="Welcome back" description="Sign in to access your ISTAD community workspace.">
    <Seo title="Sign in" description="Sign in to your ISTAD Forum account." indexable={false} />
    <form className="mt-7 space-y-4" onSubmit={onSubmit}>
      {error && <Alert variant="error" title="Sign-in failed">{errorMessage(error)}</Alert>}
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span><Input type="email" autoComplete="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span><Input type="password" autoComplete="current-password" required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /></label>
      <Button type="submit" className="w-full" isLoading={isLoading}>Sign in</Button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">New to ISTAD Forum? <Link to="/register" className="font-semibold text-brand-primary hover:underline dark:text-[#B8D0F0]">Create an account</Link></p>
  </AuthShell>;
}
