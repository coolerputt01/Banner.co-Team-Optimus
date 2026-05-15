import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { Building2, Smartphone, CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "bank" | "mobile" | "card";
  label: string;
  detail: string;
  isDefault: boolean;
}

const iconMap = {
  bank: Building2,
  mobile: Smartphone,
  card: CreditCard,
};

const PaymentMethods: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "pm1", type: "bank", label: "GTBank", detail: "****4521 · Savings", isDefault: true },
    { id: "pm2", type: "mobile", label: "Opay", detail: "****8812 · Mobile Money", isDefault: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newType, setNewType] = useState<"bank" | "mobile" | "card">("bank");

  const setDefault = (id: string) =>
    setMethods((m) => m.map((p) => ({ ...p, isDefault: p.id === id })));

  const remove = (id: string) =>
    setMethods((m) => m.filter((p) => p.id !== id));

  const addMethod = () => {
    if (!newLabel || !newDetail) return;
    setMethods((m) => [
      ...m,
      { id: `pm${Date.now()}`, type: newType, label: newLabel, detail: newDetail, isDefault: false },
    ]);
    setNewLabel("");
    setNewDetail("");
    setShowAdd(false);
  };

  return (
    <SettingsSubLayout title="Payment Methods">
      {/* Info banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
        <p className="text-[11px] font-bold text-primary leading-snug">
          💳 Add your bank account or mobile wallet to receive withdrawals. Minimum withdrawal is ₦500.
        </p>
      </div>

      {/* Method list */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {methods.map((m) => {
          const Icon = iconMap[m.type];
          return (
            <div key={m.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-text-main uppercase tracking-tight">{m.label}</p>
                <p className="text-[10px] text-text-sub">{m.detail}</p>
                {m.isDefault && (
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">● Default</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!m.isDefault && (
                  <button
                    onClick={() => setDefault(m.id)}
                    className="text-[9px] font-black text-primary border border-primary/30 px-2 py-1 rounded-lg uppercase tracking-wider hover:bg-primary/5"
                  >
                    Set Default
                  </button>
                )}
                {m.isDefault && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                <button onClick={() => remove(m.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add method */}
      {showAdd ? (
        <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden p-5 space-y-4">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Add Payment Method</p>

          {/* Type selector */}
          <div className="grid grid-cols-3 gap-2">
            {(["bank", "mobile", "card"] as const).map((t) => {
              const Icon = iconMap[t];
              return (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${
                    newType === t ? "border-primary bg-primary/10 text-primary" : "border-border-subtle text-text-sub"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{t}</span>
                </button>
              );
            })}
          </div>

          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={newType === "bank" ? "Bank name (e.g., GTBank)" : newType === "mobile" ? "Provider (e.g., Opay)" : "Card holder name"}
            className="input-field text-sm"
          />
          <input
            value={newDetail}
            onChange={(e) => setNewDetail(e.target.value)}
            placeholder={newType === "bank" ? "Account number" : newType === "mobile" ? "Phone number" : "Card number"}
            className="input-field text-sm"
          />

          <div className="flex gap-3">
            <button onClick={() => setShowAdd(false)} className="flex-1 h-12 rounded-2xl border border-border-subtle text-sm font-black text-text-sub uppercase tracking-wider">Cancel</button>
            <button onClick={addMethod} className="flex-1 h-12 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-wider hover:brightness-110">Add</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-4 border-2 border-dashed border-border-subtle rounded-3xl flex items-center justify-center gap-2 text-text-sub hover:border-primary/40 hover:text-primary transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[11px] font-black uppercase tracking-widest">Add Payment Method</span>
        </button>
      )}
    </SettingsSubLayout>
  );
};

export default PaymentMethods;
