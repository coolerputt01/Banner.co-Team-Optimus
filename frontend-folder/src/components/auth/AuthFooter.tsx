import React from "react";

interface AuthFooterProps {
  prompt: string;
  linkText: string;
  onLinkClick?: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  prompt,
  linkText,
  onLinkClick,
}) => {
  return (
    <footer className="p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-950/30">
      <p className="text-sm text-slate-500">
        {prompt}
        <button
          onClick={onLinkClick}
          className="font-bold text-primary ml-1 hover:underline"
        >
          {linkText}
        </button>
      </p>

      <div className="flex gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        <a
          href="/terms"
          className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Terms
        </a>
        <a
          href="/privacy"
          className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Privacy
        </a>
        <a
          href="/support"
          className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
};
