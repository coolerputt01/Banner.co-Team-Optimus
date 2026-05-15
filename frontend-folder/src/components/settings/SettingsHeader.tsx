import React from "react";
import { ArrowLeft } from "lucide-react";

interface SettingsHeaderProps {
  title: string;
  onBack?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  onBack,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-main-bg/95 backdrop-blur-md px-4 py-3 border-b border-border-subtle">
      <button
        onClick={onBack}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors text-text-main"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h1 className="flex-1 text-center pr-11 text-base font-black text-text-main italic uppercase tracking-tight">
        {title}
      </h1>
    </header>
  );
};
