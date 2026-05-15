import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  CreditCard,
  Smartphone,
  Building2,
} from "lucide-react";
import { WalletTransaction } from "@/types/user";

// ─── Mock data ────────────────────────────────────────────────────────────────
const transactions: WalletTransaction[] = [
  {
    id: "tx_001",
    type: "credit",
    amount: 50,
    date: new Date(Date.now() - 2 * 60000).toISOString(),
    description: "Earned from Nike Summer Vibes ad",
    status: "completed",
  },
  {
    id: "tx_002",
    type: "credit",
    amount: 100,
    date: new Date(Date.now() - 1 * 3600000).toISOString(),
    description: "Earned from Tesla ad",
    status: "completed",
  },
  {
    id: "tx_003",
    type: "withdrawal",
    amount: 5000,
    date: new Date(Date.now() - 3 * 3600000).toISOString(),
    description: "Withdrawal to GTBank ****4521",
    status: "completed",
  },
  {
    id: "tx_004",
    type: "credit",
    amount: 75,
    date: new Date(Date.now() - 6 * 3600000).toISOString(),
    description: "Earned from Spotify ad",
    status: "completed",
  },
  {
    id: "tx_005",
    type: "withdrawal",
    amount: 2000,
    date: new Date(Date.now() - 24 * 3600000).toISOString(),
    description: "Withdrawal to Opay ****8812",
    status: "pending",
  },
  {
    id: "tx_006",
    type: "credit",
    amount: 45,
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: "Earned from Coca-Cola ad",
    status: "completed",
  },
  {
    id: "tx_007",
    type: "credit",
    amount: 85,
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: "Earned from Samsung Galaxy ad",
    status: "completed",
  },
  {
    id: "tx_008",
    type: "withdrawal",
    amount: 1500,
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    description: "Withdrawal to Palmpay ****3301",
    status: "failed",
  },
];

const withdrawalMethods = [
  { id: "bank", icon: Building2, label: "Bank Transfer", detail: "GTBank ****4521" },
  { id: "mobile", icon: Smartphone, label: "Mobile Money", detail: "Opay ****8812" },
  { id: "card", icon: CreditCard, label: "Debit Card", detail: "Add a card" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTimeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const StatusIcon: React.FC<{ status: WalletTransaction["status"] }> = ({ status }) => {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "pending") return <Clock className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
};

// ─── Withdraw Modal ───────────────────────────────────────────────────────────
const WithdrawModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [step, setStep] = useState<"amount" | "confirm" | "success">("amount");

  const handleConfirm = () => {
    if (step === "amount" && Number(amount) > 0) setStep("confirm");
    else if (step === "confirm") setStep("success");
    else onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-md p-6 shadow-2xl">
        {step === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-text-main italic uppercase tracking-tight mb-2">
              Withdrawal Sent!
            </h3>
            <p className="text-text-sub text-sm mb-8">
              ₦{Number(amount).toLocaleString()} is on its way. Usually arrives within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="w-full h-14 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-text-main italic uppercase tracking-tight">
                {step === "amount" ? "Withdraw Funds" : "Confirm Withdrawal"}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-sub hover:text-text-main transition-colors"
              >
                ✕
              </button>
            </div>

            {step === "amount" ? (
              <>
                {/* Amount input */}
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub mb-2 block">
                    Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-field pl-10 text-2xl font-black"
                    />
                  </div>
                  <p className="text-[10px] text-text-sub mt-2 font-bold">
                    Available: ₦9,250.00
                  </p>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[500, 1000, 2500, 5000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(String(v))}
                      className="py-2 rounded-xl bg-surface text-text-sub text-xs font-black hover:bg-primary/10 hover:text-primary transition-all border border-border-subtle"
                    >
                      ₦{v.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Method selection */}
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub mb-3 block">
                    Withdrawal Method
                  </label>
                  <div className="space-y-2">
                    {withdrawalMethods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          selectedMethod === m.id
                            ? "border-primary bg-primary/5"
                            : "border-border-subtle bg-surface hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedMethod === m.id ? "bg-primary text-white" : "bg-surface text-text-sub"
                        }`}>
                          <m.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-black text-text-main uppercase tracking-tight">{m.label}</p>
                          <p className="text-[10px] text-text-sub">{m.detail}</p>
                        </div>
                        {selectedMethod === m.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6 space-y-4">
                <div className="bg-surface rounded-2xl p-5 border border-border-subtle">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-sub text-sm font-bold">Amount</span>
                    <span className="text-text-main font-black text-xl">₦{Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-sub text-sm font-bold">Method</span>
                    <span className="text-text-main font-black text-sm">
                      {withdrawalMethods.find((m) => m.id === selectedMethod)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-sub text-sm font-bold">Fee</span>
                    <span className="text-emerald-500 font-black text-sm">Free</span>
                  </div>
                </div>
                <p className="text-[11px] text-text-sub text-center">
                  Funds typically arrive within 24 hours.
                </p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={step === "amount" && !amount}
              className="w-full h-14 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {step === "amount" ? "Continue" : "Confirm Withdrawal"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Wallet Page ─────────────────────────────────────────────────────────
const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("wallet");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "withdrawal">("all");

  const filteredTx = transactions.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  const availableBalance = 9250;
  const pendingBalance = 3200;
  const totalEarned = 12450;

  return (
    <div className="min-h-screen w-full bg-main-bg flex overflow-hidden font-sans transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/upload")}
      />

      <main className="flex-1 flex flex-col lg:ml-64 xl:ml-72 min-h-screen overflow-y-auto no-scrollbar">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-main-bg/95 backdrop-blur-md border-b border-border-subtle px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors lg:hidden"
          >
            <ArrowDownLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-lg font-black text-text-main italic uppercase tracking-tight flex-1 text-center lg:text-left">
            WALLET
          </h1>
          <div className="w-10 lg:hidden" />
        </header>

        <div className="flex-1 flex flex-col xl:flex-row">
          {/* ── Left / Main column ── */}
          <div className="flex-1 p-4 lg:p-8 pb-32 lg:pb-10 space-y-6">

            {/* Balance card */}
            <div className="relative bg-primary rounded-[32px] p-6 overflow-hidden shadow-2xl shadow-primary/20">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-black/5 select-none uppercase italic pointer-events-none">
                CASH
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-black/10 p-2 rounded-xl">
                    <WalletIcon className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em]">
                    Banner.co Wallet
                  </span>
                </div>
                <p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-1">
                  Available Balance
                </p>
                <h2 className="text-5xl font-black text-black tracking-tighter italic mb-8">
                  ₦{availableBalance.toLocaleString()}
                </h2>
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="w-full py-4 bg-black text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all active:scale-[0.98]"
                >
                  WITHDRAW FUNDS <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-[24px] p-5 border border-border-subtle">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">
                  Pending
                </p>
                <p className="text-2xl font-black text-yellow-500 italic tracking-tight">
                  ₦{pendingBalance.toLocaleString()}
                </p>
                <p className="text-[10px] text-text-sub mt-1">Clears in 24–48h</p>
              </div>
              <div className="bg-surface rounded-[24px] p-5 border border-border-subtle">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">
                  Total Earned
                </p>
                <p className="text-2xl font-black text-emerald-500 italic tracking-tight">
                  ₦{totalEarned.toLocaleString()}
                </p>
                <p className="text-[10px] text-text-sub mt-1">All time</p>
              </div>
            </div>

            {/* Transaction history */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-sub">
                  Transaction History
                </h3>
                {/* Filter pills */}
                <div className="flex gap-2">
                  {(["all", "credit", "withdrawal"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        filter === f
                          ? "bg-primary text-white"
                          : "bg-surface text-text-sub border border-border-subtle hover:border-primary/30"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-[24px] border border-border-subtle overflow-hidden divide-y divide-border-subtle">
                {filteredTx.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <WalletIcon className="h-10 w-10 text-text-sub/20 mb-3" />
                    <p className="text-text-sub text-xs font-black uppercase tracking-widest">
                      No transactions
                    </p>
                  </div>
                ) : (
                  filteredTx.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 px-5 py-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          tx.type === "credit"
                            ? "bg-emerald-500/10"
                            : "bg-primary/10"
                        }`}
                      >
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-text-main uppercase tracking-tight truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusIcon status={tx.status} />
                          <span className="text-[10px] text-text-sub capitalize">
                            {tx.status} · {formatTimeAgo(tx.date)}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <span
                        className={`font-black text-sm flex-shrink-0 ${
                          tx.type === "credit" ? "text-emerald-500" : "text-text-main"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Right sidebar (desktop) ── */}
          <aside className="hidden xl:flex flex-col w-[360px] p-8 space-y-6 border-l border-border-subtle bg-surface/30">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-sub">
              Withdrawal Methods
            </h3>
            <div className="space-y-3">
              {withdrawalMethods.map((m) => (
                <button
                  key={m.id}
                  className="w-full flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border-subtle hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <m.icon className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-black text-text-main uppercase tracking-tight">{m.label}</p>
                    <p className="text-[10px] text-text-sub">{m.detail}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-sub/30 group-hover:text-primary transition-colors" />
                </button>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-sub hover:border-primary/40 hover:text-primary transition-all">
                + Add Method
              </button>
            </div>

            <div className="bg-surface rounded-[24px] p-5 border border-border-subtle">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-4">
                Earnings Breakdown
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Ads Watched", value: "1,247", color: "bg-primary" },
                  { label: "Referral Bonus", value: "₦500", color: "bg-emerald-500" },
                  { label: "Streak Bonus", value: "₦250", color: "bg-yellow-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-text-sub font-bold">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-text-main">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
};

export default Wallet;
