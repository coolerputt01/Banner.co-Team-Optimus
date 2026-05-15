import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

const TaxInfo: React.FC = () => {
  const [country, setCountry] = useState("Nigeria");
  const [taxId, setTaxId] = useState("");
  const [saved, setSaved] = useState(false);

  const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom", "Canada"];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSubLayout title="Tax Info">
      {/* Info card */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 leading-snug">
          Tax information is required for users who earn over ₦1,000,000 per year. Providing accurate info ensures smooth payouts.
        </p>
      </div>

      {/* Tax status */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Tax Status</p>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${taxId ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
            {taxId ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
          </div>
          <div>
            <p className="text-sm font-black text-text-main uppercase tracking-tight">
              {taxId ? "Tax ID Provided" : "No Tax ID"}
            </p>
            <p className="text-[10px] text-text-sub mt-0.5">
              {taxId ? "Your tax information is on file." : "Add your tax ID to avoid payment holds."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {/* Country */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-2">Country / Region</p>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-text-main outline-none"
          >
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tax ID */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-2">Tax ID / TIN</p>
          <input
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Enter your Tax Identification Number"
            className="w-full bg-transparent text-sm font-bold text-text-main outline-none placeholder:text-text-sub"
          />
        </div>

        {/* Form type */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-2">Form Type</p>
          <p className="text-sm font-bold text-text-main">
            {country === "United States" ? "W-9 (US Person)" : "W-8BEN (Non-US Person)"}
          </p>
          <p className="text-[10px] text-text-sub mt-0.5">Auto-selected based on your country</p>
        </div>
      </div>

      {/* Download form */}
      <button className="w-full flex items-center gap-4 bg-surface border border-border-subtle rounded-3xl px-5 py-4 hover:bg-primary/5 transition-colors">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-black text-text-main uppercase tracking-tight">Download Tax Form</p>
          <p className="text-[10px] text-text-sub">PDF · {country === "United States" ? "W-9" : "W-8BEN"}</p>
        </div>
        <span className="text-[10px] text-primary font-black uppercase tracking-wider">Download</span>
      </button>

      <button
        onClick={handleSave}
        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:brightness-110"
        }`}
      >
        {saved ? "✓ Saved!" : "Save Tax Info"}
      </button>
    </SettingsSubLayout>
  );
};

export default TaxInfo;
