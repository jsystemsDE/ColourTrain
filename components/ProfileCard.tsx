'use client';

interface ProfileCardProps {
  username: string | null;
  email: string | null;
  avatarUrl?: string | null;
}

const ProfileCard = ({ username, email, avatarUrl }: ProfileCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="profile"
          className="h-24 w-24 rounded-full border border-muted-text object-cover"
        />
      ) : (
        <div className="h-24 w-24 rounded-full border border-muted-text bg-container-cards" />
      )}
      {username && <p className="text-primary-text">{username}</p>}
      {email && <p className="text-sm text-muted-text">{email}</p>}
    </div>
  );
};

export default ProfileCard;