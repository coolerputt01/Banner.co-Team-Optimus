import { QrCode } from "lucide-react";
import React from "react";

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onQRLogin?: () => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onAppleLogin,
  onQRLogin,
}) => {
  return (
    <div className="mt-12 space-y-8">
      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Google Button */}
        <button
          onClick={onGoogleLogin}
          className="flex items-center justify-center gap-3 h-14 bg-slate-100 dark:bg-slate-900 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              fill="#EA4335"
            />
            <path
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
              fill="#34A853"
            />
            <path
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.934 11.934 0 000 10.76l3.98-3.09z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              fill="#4285F4"
            />
          </svg>
          <span className="font-bold text-slate-900 dark:text-white">
            Google
          </span>
        </button>

        {/* Apple Button */}
        <button
          onClick={onAppleLogin}
          className="flex items-center justify-center gap-3 h-14 bg-slate-100 dark:bg-slate-900 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <svg
            className="w-6 h-6 fill-current text-black dark:text-white"
            viewBox="0 0 24 24"
          >
            <path d="M17.05 20.28c-.96.95-2.06 1.92-3.37 1.92s-1.73-.78-3.33-.78c-1.6 0-2.1 0-3.32.78-1.21 0-2.31-1.05-3.27-2-1.95-2.81-3.43-7.94-1.42-11.39a5.1 5.1 0 014.33-2.58c1.36 0 2.29.83 3.3.83.99 0 2.15-.83 3.53-.83a4.72 4.72 0 013.96 2.13 4.54 4.54 0 00-2.61 4.07c0 3.22 2.63 4.35 2.63 4.35-.02.08-.41 1.43-1.4 2.91M12.03 5.33c0-2.26 1.88-4.08 4.04-4.08.03.49-.15 2.37-1.95 4.08-1.67 1.58-3.43 1.34-4.04 1.34-.05-1.05 0-1.34 1.95-1.34z" />
          </svg>
          <span className="font-bold text-slate-900 dark:text-white">
            Apple
          </span>
        </button>
      </div>

      {/* QR Code Login */}
      {onQRLogin && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onQRLogin}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <QrCode className="h-5 w-5" />
            <span className="text-sm font-semibold">Log in with QR code</span>
          </button>
        </div>
      )}
    </div>
  );
};
