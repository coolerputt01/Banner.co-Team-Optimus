import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { ChevronRight, ChevronDown, Search, MessageCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  { q: "How do I earn money on Banner.co?", a: "You earn by watching brand advertisements in your feed. Each ad has an earnings value displayed as a badge. Simply watch the ad and the amount is automatically credited to your balance." },
  { q: "When can I withdraw my earnings?", a: "You can withdraw once you reach the minimum threshold (₦500). Go to Wallet → Withdraw to initiate. Withdrawals are processed within 1–3 business days depending on your method." },
  { q: "Why did my withdrawal fail?", a: "Failed withdrawals can happen due to incorrect account details, expired card information, or network issues. Check your payment method details in Settings → Payment Methods and try again." },
  { q: "How do I change my withdrawal method?", a: "Go to Settings → Payment Methods to add, remove, or set a new default withdrawal destination." },
  { q: "What types of ads will I see?", a: "Your feed is personalized based on your interests, location, and engagement history. Turning on Personalized Ads in Privacy settings improves ad relevance and can increase your earnings." },
  { q: "How does the referral program work?", a: "Share your unique referral link from your profile. When a friend signs up and watches their first ad, you both receive a ₦50 bonus." },
  { q: "Can I delete my account?", a: "Yes. Go to Settings → Manage Account → Delete Account. Your data will be permanently deleted within 30 days. Any pending balance will be refunded to your payment method." },
  { q: "Why am I seeing fewer ads?", a: "Ad availability depends on your location, interests, and time of day. Make sure Personalized Ads is enabled in Privacy settings for the best ad delivery." },
];

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SettingsSubLayout title="Help Center">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-sub" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles..."
          className="input-field pl-11"
        />
      </div>

      {/* FAQ */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center text-center gap-3">
            <Search className="h-8 w-8 text-text-sub/30" />
            <p className="text-sm font-black text-text-sub uppercase tracking-widest">No results for "{query}"</p>
          </div>
        ) : (
          filtered.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
              >
                <p className="text-sm font-black text-text-main uppercase tracking-tight flex-1">
                  {faq.q}
                </p>
                <div className="flex-shrink-0 mt-0.5">
                  {open === i ? (
                    <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-text-sub/30" />
                  )}
                </div>
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-text-sub leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact support */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        <div className="px-5 py-3">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Still need help?</p>
        </div>
        <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black text-text-main uppercase tracking-tight">Chat with Support</p>
            <p className="text-[10px] text-text-sub">Typically replies in under 2 hours</p>
          </div>
          <ChevronRight className="h-4 w-4 text-text-sub/30" />
        </button>
        <button
          onClick={() => navigate("/settings/report")}
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black text-text-main uppercase tracking-tight">Report a Problem</p>
            <p className="text-[10px] text-text-sub">Submit a bug report or feedback</p>
          </div>
          <ChevronRight className="h-4 w-4 text-text-sub/30" />
        </button>
      </div>
    </SettingsSubLayout>
  );
};

export default HelpCenter;
