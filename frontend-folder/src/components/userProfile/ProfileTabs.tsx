import React from "react";
import { Bookmark, Share2, Wallet, Activity } from "lucide-react";
import { ProfileTab } from "../../types/user";

const tabs = [
  { id: "bookmarks" as ProfileTab, Icon: Bookmark, label: "SAVED" },
  { id: "shared"    as ProfileTab, Icon: Share2,   label: "SHARES" },
  { id: "earnings"  as ProfileTab, Icon: Wallet,   label: "WALLET" },
  { id: "activity"  as ProfileTab, Icon: Activity, label: "LOGS" },
] as const;

export const ProfileTabs: React.FC<{
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-border-subtle overflow-x-auto no-scrollbar">
      {tabs.map(({ id, Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 min-w-[72px] py-4 flex flex-col items-center gap-1.5 transition-all relative ${
              active ? "text-primary" : "text-text-sub hover:text-text-main"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
            <span className="text-[9px] font-black tracking-widest whitespace-nowrap">
              {label}
            </span>
            {active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
};
