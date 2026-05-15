import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { ChevronRight } from "lucide-react";

interface ToggleRowProps { label: string; description?: string; value: boolean; onChange: () => void; }
const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle last:border-0">
    <div className="flex-1 pr-4">
      <p className="text-sm font-black text-text-main uppercase tracking-tight">{label}</p>
      {description && <p className="text-[10px] text-text-sub mt-0.5">{description}</p>}
    </div>
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${value ? "bg-primary" : "bg-border-subtle"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${value ? "left-[calc(100%-22px)]" : "left-0.5"}`} />
    </button>
  </div>
);

const WithdrawalPreferences: React.FC = () => {
  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [minAmount, setMinAmount] = useState("500");
  const [frequency, setFrequency] = useState("weekly");

  return (
    <SettingsSubLayout title="Withdrawal Preferences">
      {/* Auto-withdraw */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Automatic Withdrawals</p>
        </div>
        <ToggleRow
          label="Auto-Withdraw"
          description="Automatically withdraw funds when balance reaches your minimum."
          value={autoWithdraw}
          onChange={() => setAutoWithdraw((p) => !p)}
        />
        {autoWithdraw && (
          <>
            {/* Frequency */}
            <div className="px-5 py-4 border-b border-border-subtle">
              <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-3">Frequency</p>
              <div className="grid grid-cols-3 gap-2">
                {["daily", "weekly", "monthly"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                      frequency === f ? "border-primary bg-primary/10 text-primary" : "border-border-subtle text-text-sub"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Min amount */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Minimum Withdrawal Amount</p>
        </div>
        <div className="px-5 py-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {["500", "1000", "2500", "5000"].map((v) => (
              <button
                key={v}
                onClick={() => setMinAmount(v)}
                className={`py-2 rounded-xl border text-[10px] font-black transition-all ${
                  minAmount === v ? "border-primary bg-primary/10 text-primary" : "border-border-subtle text-text-sub"
                }`}
              >
                ₦{Number(v).toLocaleString()}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-sub">
            Current minimum: <span className="font-black text-primary">₦{Number(minAmount).toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Preferred method */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Preferred Method</p>
        </div>
        <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-primary/5 transition-colors">
          <div className="flex-1 text-left">
            <p className="text-sm font-black text-text-main uppercase tracking-tight">GTBank ****4521</p>
            <p className="text-[10px] text-text-sub">Bank Transfer · Default</p>
          </div>
          <ChevronRight className="h-4 w-4 text-text-sub/30" />
        </button>
      </div>

      {/* Info */}
      <div className="bg-surface rounded-3xl border border-border-subtle px-5 py-4">
        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-2">Processing Times</p>
        <ul className="space-y-1.5">
          {[
            ["Bank Transfer", "1–3 business days"],
            ["Mobile Money", "Instant–1 hour"],
            ["Debit Card", "1–2 business days"],
          ].map(([method, time]) => (
            <li key={method} className="flex justify-between items-center">
              <span className="text-xs text-text-sub">{method}</span>
              <span className="text-xs font-black text-text-main">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </SettingsSubLayout>
  );
};

export default WithdrawalPreferences;
