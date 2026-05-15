import React from "react";
import { NotificationTab } from "../../types/inbox";

interface InboxTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  counts?: {
    all?: number;
    replies?: number;
    mentions?: number;
    earnings?: number;
  };
}

export const InboxTabs: React.FC<InboxTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: NotificationTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: counts?.all },
    { id: "replies", label: "Replies", count: counts?.replies },
    { id: "mentions", label: "Mentions", count: counts?.mentions },
    { id: "earnings", label: "Earnings", count: counts?.earnings },
  ];

  return (
    <nav className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1" aria-label="Notification filters">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-black whitespace-nowrap transition-all min-h-[40px] ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-surface text-text-sub border border-border-subtle hover:border-primary/30 hover:text-text-main"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={`ml-1.5 text-xs ${
                activeTab === tab.id ? "text-white/80" : "text-text-sub"
              }`}
            >
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};
