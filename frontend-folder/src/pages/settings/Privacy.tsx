import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";

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
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        value ? "bg-primary" : "bg-border-subtle"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          value ? "left-[calc(100%-22px)]" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

const Privacy: React.FC = () => {
  const [prefs, setPrefs] = useState({
    privateAccount: false,
    showEarnings: true,
    allowDMs: true,
    showOnlineStatus: true,
    allowTagging: true,
    personalizedAds: true,
    dataSharing: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <SettingsSubLayout title="Privacy">
      {/* Account Privacy */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Account Privacy</p>
        </div>
        <ToggleRow label="Private Account" description="Only approved followers can see your activity and earnings." value={prefs.privateAccount} onChange={() => toggle("privateAccount")} />
        <ToggleRow label="Show Earnings" description="Let others see your total earnings on your profile." value={prefs.showEarnings} onChange={() => toggle("showEarnings")} />
        <ToggleRow label="Show Online Status" description="Let followers see when you're active." value={prefs.showOnlineStatus} onChange={() => toggle("showOnlineStatus")} />
        <ToggleRow label="Allow Tagging" description="Allow others to mention you in posts and comments." value={prefs.allowTagging} onChange={() => toggle("allowTagging")} />
      </div>

      {/* Messages */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Messages & Contacts</p>
        </div>
        <ToggleRow label="Allow Direct Messages" description="Receive chat messages from brands and other users." value={prefs.allowDMs} onChange={() => toggle("allowDMs")} />
      </div>

      {/* Notifications */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Notifications</p>
        </div>
        <ToggleRow label="Email Notifications" description="Receive earnings reports and updates via email." value={prefs.emailNotifications} onChange={() => toggle("emailNotifications")} />
        <ToggleRow label="Push Notifications" description="Get real-time alerts on your device." value={prefs.pushNotifications} onChange={() => toggle("pushNotifications")} />
        <ToggleRow label="SMS Notifications" description="Receive important alerts via SMS." value={prefs.smsNotifications} onChange={() => toggle("smsNotifications")} />
      </div>

      {/* Data & Ads */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Data & Advertising</p>
        </div>
        <ToggleRow label="Personalized Ads" description="Use your interests and activity to show you more relevant ads (earns more)." value={prefs.personalizedAds} onChange={() => toggle("personalizedAds")} />
        <ToggleRow label="Share Data with Partners" description="Allow Banner.co to share anonymized data with advertising partners." value={prefs.dataSharing} onChange={() => toggle("dataSharing")} />
      </div>

      {/* Blocked users */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Blocked Users</p>
        </div>
        <div className="px-5 py-5 flex items-center justify-between">
          <p className="text-sm text-text-sub">No blocked users</p>
          <button className="text-[10px] font-black text-primary uppercase tracking-wider">Manage</button>
        </div>
      </div>
    </SettingsSubLayout>
  );
};

export default Privacy;
