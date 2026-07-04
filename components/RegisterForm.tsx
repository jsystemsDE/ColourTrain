'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';

const RegisterForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !email || !password) return;

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setMessage('Check your email to confirm your account, then sign in.');
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      <h1 className="mb-8 text-5xl">colourtrain</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        className="mb-4 w-full max-w-sm rounded border border-muted-text bg-container-cards p-2 text-primary-text"
      />
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
        autoComplete="new-password"
        minLength={6}
        className="mb-4 w-full max-w-sm rounded border border-muted-text bg-container-cards p-2 text-primary-text"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-sniper-highlight px-6 py-3 text-black disabled:opacity-50"
      >
        {loading ? 'creating account...' : 'create account'}
      </button>
      <Link
        href="/login"
        className="mt-4 text-muted-text hover:text-primary-text"
      >
        already have an account? sign in
      </Link>
      {message && (
        <p
          className={`mt-4 max-w-sm text-center ${
            message.includes('Check your email') ? 'text-sniper-highlight' : 'text-alert-red'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
