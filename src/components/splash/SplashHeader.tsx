import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SplashHeaderProps {
  onSkip?: () => void;
  className?: string;
}

export const SplashHeader: React.FC<SplashHeaderProps> = ({ onSkip, className }) => {
  return (
    <header className="relative z-10 flex w-full justify-end p-6">
      <button
        onClick={onSkip}
        className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors ${className}`}
      >
        Skip
        <ChevronRight className="h-4 w-4" />
      </button>
    </header>
  );
};