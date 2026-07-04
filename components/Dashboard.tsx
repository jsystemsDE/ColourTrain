'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import supabase from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';

const Dashboard = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, profile_picture_url')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        setAvatarUrl(profile.profile_picture_url);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-background">
      <header className="absolute right-4 top-4 flex items-center space-x-4">
        <button onClick={handleSignOut} className="text-primary-text">
          sign out
        </button>
        <Link
          href="/settings"
          className="flex items-center space-x-2 text-primary-text"
        >
          <FiSettings className="h-6 w-6" />
          <span className="text-sm">einstellungen</span>
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center space-y-8">
        <ProfileCard username={username} email={email} avatarUrl={avatarUrl} />
        {Array.from({ length: 4 }, (_, i) => (
          <button
            key={i}
            onClick={() => router.push(`/config/${i + 1}`)}
            className="h-20 w-64 rounded border border-muted-text bg-container-cards p-4 text-primary-text"
          >
            variant {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;