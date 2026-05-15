import React from "react";
import { ArrowLeft, Settings, Share2 } from "lucide-react";

interface ProfileHeaderProps {
  title: string;
  onBack?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  title,
  onBack,
  onSettings,
  onShare,
}) => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-main-bg/90 backdrop-blur-md border-b border-border-subtle">
      <button
        onClick={onBack}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5 text-text-main" />
      </button>

      <h1 className="text-sm font-black text-text-main italic uppercase tracking-widest">
        {title}
      </h1>

      <div className="flex gap-1">
        <button
          onClick={onShare}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
          aria-label="Share profile"
        >
          <Share2 className="h-5 w-5 text-text-main" />
        </button>
        <button
          onClick={onSettings}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-text-main" />
        </button>
      </div>
    </div>
  );
};
