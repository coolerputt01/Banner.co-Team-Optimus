import React from "react";
import { Eye, Clock, TrendingUp } from "lucide-react";
import { EarningsData } from "../../types/user";

interface EarningsStatsProps {
  earnings: EarningsData;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const EarningsStats: React.FC<EarningsStatsProps> = ({ earnings }) => {
  return (
    <div className="flex justify-center gap-4 sm:gap-6 px-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-primary mb-1">
          <Eye className="h-4 w-4" />
          <span className="text-lg font-black text-text-main">
            {formatNumber(earnings.adsWatched)}
          </span>
        </div>
        <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
          Ads Watched
        </span>
      </div>

      <div className="flex flex-col items-center border-x border-border-subtle px-4 sm:px-6">
        <div className="flex items-center gap-1 text-coral mb-1">
          <Clock className="h-4 w-4" />
          <span className="text-lg font-black text-text-main">
            {earnings.watchTime}m
          </span>
        </div>
        <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
          Watch Time
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-emerald-500 mb-1">
          <TrendingUp className="h-4 w-4" />
          <span className="text-lg font-black text-text-main">
            {earnings.currency}{formatNumber(earnings.totalEarned)}
          </span>
        </div>
        <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
          Total Earned
        </span>
      </div>
    </div>
  );
};
