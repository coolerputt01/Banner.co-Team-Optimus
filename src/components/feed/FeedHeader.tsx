import React from "react";
import { Search } from "lucide-react";

interface FeedHeaderProps {
  activeTab: "forYou" | "explore";
  onTabChange: (tab: "forYou" | "explore") => void;
  onSearch?: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  activeTab,
  onTabChange,
  onSearch,
}) => {
  return (
    <header className="flex items-center justify-between w-full">
      {/* Spacer */}
      <div className="flex-1" />

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-1 py-1 border border-white/10">
        {(["forYou", "explore"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-black transition-all min-h-[36px] ${
              activeTab === tab
                ? "bg-white text-black shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            {tab === "forYou" ? "For You" : "Explore"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={onSearch}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-primary transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
