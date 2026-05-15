import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsAppearance } from "@/components/settings/SettingsAppearance";
import { SettingsLogout } from "@/components/settings/SettingLogout";
import { Navigation } from "@/components/navigation/Navigation";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("profile");

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/upload")}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <SettingsHeader title="Settings & Privacy" onBack={() => navigate(-1)} />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 lg:px-8 lg:py-6 pb-28 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            {/* Left column */}
            <div>
              <SettingsSection
                title="Account"
                items={[
                  { id: "manage-account", icon: "person",       label: "Manage account",  type: "link" },
                  { id: "privacy",        icon: "lock",          label: "Privacy",          type: "link" },
                  { id: "safety",         icon: "shield_person", label: "Safety",           type: "link" },
                ]}
                onItemClick={(id) => navigate(`/settings/${id}`)}
              />

              <SettingsSection
                title="Wallet & Earnings"
                items={[
                  { id: "payment-methods", icon: "payments",               label: "Payment methods",        type: "link" },
                  { id: "withdrawal",      icon: "account_balance_wallet",  label: "Withdrawal preferences", type: "link" },
                  { id: "tax-info",        icon: "description",             label: "Tax info",               type: "link" },
                ]}
                onItemClick={(id) => navigate(`/settings/${id}`)}
              />

              <SettingsSection
                title="Cache & Cellular"
                items={[
                  { id: "free-up-space", icon: "delete_sweep", label: "Free up space", type: "link" },
                  { id: "data-saver",    icon: "speed",         label: "Data saver",    type: "select", value: "Off" },
                ]}
                onItemClick={(id) => id !== "data-saver" && navigate(`/settings/${id}`)}
              />
            </div>

            {/* Right column */}
            <div>
              <SettingsAppearance />

              <SettingsSection
                title="Support"
                items={[
                  { id: "help",   icon: "help",   label: "Help center",      type: "link" },
                  { id: "report", icon: "report", label: "Report a problem", type: "link" },
                  { id: "terms",  icon: "gavel",  label: "Terms & policies", type: "link" },
                ]}
                onItemClick={(id) => navigate(`/settings/${id}`)}
              />

              <SettingsLogout onLogout={() => navigate("/")} version="12.4.0 (2026)" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
