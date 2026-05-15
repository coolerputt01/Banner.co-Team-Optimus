import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { Shield, Smartphone, Lock } from "lucide-react";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}
const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle last:border-0">
    <div className="flex-1 pr-4">
      <p className="text-sm font-black text-text-main uppercase tracking-tight">{label}</p>
      {description && <p className="text-[10px] text-text-sub mt-0.5 leading-snug">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${value ? "bg-primary" : "bg-border-subtle"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? "left-[calc(100%-22px)]" : "left-0.5"}`} />
    </button>
  </div>
);

const Safety: React.FC = () => {
  const [prefs, setPrefs] = useState({
    twoFactor: false,
    restrictedMode: false,
    sensitiveContent: true,
    loginAlerts: true,
    fraudProtection: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <SettingsSubLayout title="Safety">
      {/* Security summary card */}
      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-black text-text-main text-sm uppercase tracking-tight">
            Account Security
          </p>
          <p className="text-xs text-text-sub mt-1">
            Your account is {prefs.twoFactor ? "secured with 2FA ✓" : "missing 2FA — we recommend enabling it."}
          </p>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Authentication</p>
        </div>
        <ToggleRow
          label="Two-Factor Authentication"
          description="Require a verification code in addition to your password."
          value={prefs.twoFactor}
          onChange={() => toggle("twoFactor")}
        />
        <ToggleRow
          label="Login Alerts"
          description="Get notified when your account is accessed from a new device."
          value={prefs.loginAlerts}
          onChange={() => toggle("loginAlerts")}
        />
      </div>

      {/* Content */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Content Safety</p>
        </div>
        <ToggleRow
          label="Restricted Mode"
          description="Filter content that may not be appropriate for all audiences."
          value={prefs.restrictedMode}
          onChange={() => toggle("restrictedMode")}
        />
        <ToggleRow
          label="Sensitive Content Filter"
          description="Reduce the appearance of potentially sensitive ads in your feed."
          value={prefs.sensitiveContent}
          onChange={() => toggle("sensitiveContent")}
        />
        <ToggleRow
          label="Fraud Protection"
          description="Alert you to suspicious activity and potential scams."
          value={prefs.fraudProtection}
          onChange={() => toggle("fraudProtection")}
        />
      </div>

      {/* Trusted Devices */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Trusted Devices</p>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-text-sub" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-text-main uppercase tracking-tight">Chrome on Linux</p>
            <p className="text-[10px] text-text-sub">Current device · Lagos, NG</p>
          </div>
          <button className="text-[10px] font-black text-primary uppercase tracking-wider">Active</button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-colors">
          <Lock className="h-5 w-5 text-text-sub" />
          <span className="text-sm font-black text-text-main uppercase tracking-tight flex-1 text-left">Change Password</span>
          <span className="text-[10px] text-primary font-black uppercase tracking-wider">→</span>
        </button>
      </div>
    </SettingsSubLayout>
  );
};

export default Safety;
