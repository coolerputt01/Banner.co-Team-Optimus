import React from "react";
import { Coins } from "lucide-react";

interface EarningsBadgeProps {
  amount: number;
  currency?: string;
}

export const EarningsBadge: React.FC<EarningsBadgeProps> = ({
  amount,
  currency = "₦",
}) => {
  return (
    <div className="flex items-center gap-2 bg-coral/90 text-white px-3 py-1.5 rounded-full w-fit">
      <Coins className="h-4 w-4" />
      <span className="text-sm font-bold">
        Earn {currency}
        {amount}
      </span>
    </div>
  );
};
