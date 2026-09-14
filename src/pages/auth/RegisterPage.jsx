import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '@/features/auth/authApi';
import AuthShell from './AuthShell';
import Button from '@/Components/ui/button';
import Input from '@/Components/ui/Input';
import Alert from '@/Components/ui/Alert';
import Seo from '@/Components/seo/Seo';

export default function RegisterPage() {
  const [register, { isLoading, error }] = useRegisterMutation();
  const [result, setResult] = useState(null);
  const [values, setValues] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });

  async function onSubmit(event) {
    event.preventDefault();
    if (values.password !== values.confirmPassword) return;
    try {
      setResult(await register(values).unwrap());
    } catch {
      setResult(null);
    }
  }

  const passwordMismatch = values.confirmPassword && values.password !== values.confirmPassword;
  return <AuthShell title="Create your account" description="Join the ISTAD community to ask, answer, and connect.">
    <Seo title="Register" description="Create an ISTAD Forum account." indexable={false} />
    <form className="mt-7 space-y-4" onSubmit={onSubmit}>
      {error && <Alert variant="error" title="Registration failed">{error.status === 409 ? 'That email or display name is already registered.' : 'We could not create your account. Please review your details and try again.'}</Alert>}
      {result && <Alert variant="success" title="Account created">{result.message || 'Check your email to complete verification.'}</Alert>}
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Display name</span><Input autoComplete="name" required value={values.displayName} onChange={(event) => setValues({ ...values, displayName: event.target.value })} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span><Input type="email" autoComplete="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span><Input type="password" autoComplete="new-password" required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</span><Input type="password" autoComplete="new-password" required error={passwordMismatch} value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} /></label>
      {passwordMismatch && <p className="text-sm text-brand-secondary">Passwords do not match.</p>}
      <Button type="submit" className="w-full" isLoading={isLoading} disabled={passwordMismatch}>Create account</Button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">Already registered? <Link to="/login" className="font-semibold text-brand-primary hover:underline dark:text-[#B8D0F0]">Sign in</Link></p>
  </AuthShell>;
}
