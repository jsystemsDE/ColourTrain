'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import supabase from '@/lib/supabaseClient';

const ProfileSettings = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, profile_picture_url')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        setAvatarUrl(profile.profile_picture_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Cache-Buster, damit das Bild sofort aktualisiert wird
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profile_picture_url: urlWithCacheBust })
      .eq('id', user.id);

    setUploading(false);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setAvatarUrl(urlWithCacheBust);
    setMessage('Profile picture updated.');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile saved.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will sign you out.')) return;

    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-background">
        <p className="text-muted-text">loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-background px-4">
      <header className="absolute left-4 top-4 flex items-center space-x-2">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <FiArrowLeft className="h-6 w-6 text-primary-text" />
          <h1 className="text-xl font-bold">einstellungen</h1>
        </Link>
      </header>
      <div className="mt-24 flex w-full max-w-md flex-col items-center justify-center space-y-8">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handlePictureClick}
          disabled={uploading}
          className="flex h-20 w-full items-center justify-center gap-3 rounded border border-muted-text bg-container-cards p-4 text-primary-text disabled:opacity-50"
        >
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          {uploading ? 'uploading...' : 'profilepicture'}
        </button>
        <input
          type="text"
          placeholder="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-20 w-full rounded border border-muted-text bg-container-cards p-4 text-primary-text"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded bg-sniper-highlight px-6 py-3 text-black disabled:opacity-50"
        >
          {saving ? 'saving...' : 'save profile'}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="rounded bg-alert-red px-6 py-3 text-white"
        >
          delete account
        </button>
        {message && (
          <p
            className={`text-center ${
              message.includes('updated') || message === 'Profile saved.'
                ? 'text-sniper-highlight'
                : 'text-alert-red'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;