import React from "react";

interface SettingsLogoutProps {
  version?: string;
  onLogout?: () => void;
}

export const SettingsLogout: React.FC<SettingsLogoutProps> = ({
  version = "12.4.0 (2026)",
  onLogout,
}) => {
  return (
    <div className="mt-8 mb-12 px-1">
      <button
        onClick={onLogout}
        className="w-full h-14 bg-surface rounded-2xl text-red-500 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all border border-border-subtle hover:bg-red-500/5 hover:border-red-500/20"
      >
        Log Out
      </button>

      <p className="text-center text-text-sub text-[10px] mt-5 tracking-widest uppercase opacity-40">
        Version {version}
      </p>
    </div>
  );
};
