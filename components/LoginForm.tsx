'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else if (data.user) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      <h1 className="mb-8 text-5xl">colourtrain</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        className="mb-4 w-full max-w-sm rounded border border-muted-text bg-container-cards p-2 text-primary-text"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        className="mb-4 w-full max-w-sm rounded border border-muted-text bg-container-cards p-2 text-primary-text"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-sniper-highlight px-6 py-3 text-black disabled:opacity-50"
      >
        {loading ? 'signing in...' : 'sign in'}
      </button>
      <Link
        href="/register"
        className="mt-4 text-muted-text hover:text-primary-text"
      >
        no account yet? create one
      </Link>
      {message && <p className="mt-4 text-alert-red">{message}</p>}
    </form>
  );
};

export default LoginForm;
