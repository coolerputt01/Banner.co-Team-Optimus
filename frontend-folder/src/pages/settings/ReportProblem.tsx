import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { CheckCircle2, Send } from "lucide-react";

const categories = [
  "App Bug / Crash",
  "Payment / Withdrawal Issue",
  "Inappropriate Ad Content",
  "Account Hacked",
  "Earnings Not Credited",
  "Other",
];

const ReportProblem: React.FC = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("alex@example.com");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = category && description.length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SettingsSubLayout title="Report a Problem">
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-text-main uppercase tracking-tight mb-2">
            Report Submitted<span className="text-primary">.</span>
          </h2>
          <p className="text-sm text-text-sub leading-relaxed max-w-xs">
            Our team will review your report and respond to <span className="font-black text-text-main">{email}</span> within 24–48 hours.
          </p>
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mt-6">
            Reference: RPT-{Date.now().toString().slice(-6)}
          </p>
        </div>
      </SettingsSubLayout>
    );
  }

  return (
    <SettingsSubLayout title="Report a Problem">
      {/* Category */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Issue Category</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-left border transition-all ${
                category === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-subtle text-text-sub hover:border-primary/30 hover:text-text-main"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Description</p>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the problem in detail. Include steps to reproduce it if possible..."
            rows={5}
            maxLength={1000}
            className="w-full bg-transparent text-sm text-text-main placeholder:text-text-sub outline-none resize-none leading-relaxed"
          />
          <p className="text-[10px] text-text-sub text-right">{description.length}/1000</p>
          {description.length > 0 && description.length < 20 && (
            <p className="text-[10px] text-red-500 font-bold mt-1">
              Please provide at least 20 characters.
            </p>
          )}
        </div>
      </div>

      {/* Contact email */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Reply To</p>
        </div>
        <div className="px-5 py-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent text-sm font-bold text-text-main outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm bg-primary text-white hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        Submit Report
      </button>

      <p className="text-center text-[10px] text-text-sub">
        Your report is anonymous unless you include contact details above.
      </p>
    </SettingsSubLayout>
  );
};

export default ReportProblem;
