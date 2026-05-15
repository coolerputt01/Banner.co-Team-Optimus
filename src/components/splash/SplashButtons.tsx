import React from "react";

interface SplashButtonsProps {
  onSignUp?: () => void;
  onLogin?: () => void;
  theme: "light" | "dark";
}
export const SplashButtons: React.FC<SplashButtonsProps> = ({
  onSignUp,
  onLogin,
  theme,
}) => {
  const isDark = theme === "dark";

  const loginButtonClass = isDark
    ? "border-2 border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/5"
    : "border-2 border-primary/20 bg-white text-primary hover:bg-white/97";

  return (
    <div className="flex w-full flex-col gap-4 sm:max-w-md lg:max-w-full">
      <button
        onClick={onSignUp}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-coral text-lg font-bold text-white transition-all active:scale-95 shadow-lg shadow-coral/40 hover:brightness-110 sm:h-16"
      >
        Sign Up Free
      </button>

      <button
        onClick={onLogin}
        className={`flex h-14 w-full items-center justify-center rounded-2xl text-lg font-bold transition-all active:scale-95 sm:h-16 ${loginButtonClass}`}
      >
        Log In
      </button>
    </div>
  );
};