import React from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  onBack?: () => void;
  onHelp?: () => void;
  showHelp?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  onBack,
  onHelp,
  showHelp = true,
}) => (
  <header className="flex items-center justify-between px-6 py-5 lg:px-8 lg:py-6 bg-transparent border-b border-border-subtle">
    <button
      onClick={onBack}
      className="text-text-main hover:text-primary transition-all hover:-translate-x-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="Go back"
    >
      <ArrowLeft size={22} />
    </button>
    <h1 className="text-xs font-black text-text-sub tracking-[0.4em] uppercase">
      {title}
    </h1>
    {showHelp ? (
      <button
        onClick={onHelp}
        className="text-text-sub hover:text-text-main transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Help"
      >
        <HelpCircle size={20} />
      </button>
    ) : (
      <div className="w-11" />
    )}
  </header>
);
