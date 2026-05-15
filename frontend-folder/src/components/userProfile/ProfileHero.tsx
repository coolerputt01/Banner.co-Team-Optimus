import React from "react";

interface ProfileHeroProps {
  coverImage?: string;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ coverImage }) => {
  return (
    <div className="relative w-full h-36 sm:h-44 overflow-hidden bg-surface">
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format"
        }
        alt="Cover"
        className="w-full h-full object-cover opacity-70"
      />
      {/* Subtle bottom fade so avatar sits cleanly on top */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-main-bg to-transparent" />
    </div>
  );
};
