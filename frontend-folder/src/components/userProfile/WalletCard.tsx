import React from "react";
import { Wallet, ArrowUpRight, History } from "lucide-react";
import { EarningsData } from "../../types/user";

// interface WalletCardProps {
//   earnings: EarningsData;
//   onWithdraw?: () => void;
//   onHistory?: () => void;
// }

export const WalletCard: React.FC<{
  earnings: EarningsData;
  onWithdraw?: () => void;
  onHistory?: () => void;
}> = ({ earnings, onWithdraw, onHistory }) => (
  <div className="bg-primary p-6 rounded-[32px] relative overflow-hidden shadow-2xl border border-white/10">
    <div className="absolute -bottom-4 -right-2 text-6xl font-black text-black/5 select-none uppercase italic pointer-events-none">
      CASH
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-10">
        <div className="bg-black/10 p-2 rounded-xl">
          <Wallet className="h-5 w-5 text-black" />
        </div>
        <button
          onClick={onHistory}
          className="text-black/40 hover:text-black transition-colors"
        >
          <History className="h-5 w-5" />
        </button>
      </div>
      <p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-1">
        Available Funds
      </p>
      <h2 className="text-4xl font-black text-black tracking-tighter mb-8 italic">
        {earnings.currency}
        {earnings.availableBalance.toLocaleString()}
      </h2>
      <button
        onClick={onWithdraw}
        className="w-full py-4 bg-black text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all active:scale-[0.98]"
      >
        WITHDRAW <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);