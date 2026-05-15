import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing Banner.co, you agree to be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree with any of these terms, you are prohibited from using this platform. These terms may be updated at any time, and your continued use of the platform constitutes acceptance of those changes.",
  },
  {
    title: "2. Earnings & Rewards",
    content: "Users earn credits by watching advertisements on the Banner.co platform. Earnings are credited to your account balance after a verification period. Banner.co reserves the right to withhold or reverse earnings in cases of fraudulent activity, bot usage, or violation of advertiser terms. The 70/30 revenue split (user/platform) applies to all organic ad views.",
  },
  {
    title: "3. Withdrawals",
    content: "Withdrawals are subject to a minimum balance requirement (₦500). Banner.co processes withdrawals within 1–3 business days. Users are responsible for providing accurate payment information. Incorrect details may result in failed transfers, for which Banner.co is not liable. Tax obligations arising from earnings are the sole responsibility of the user.",
  },
  {
    title: "4. User Conduct",
    content: "Users must not engage in fraudulent ad viewing, create fake accounts, use bots or automated tools, share account access, or attempt to manipulate the earnings system. Violation of these rules will result in immediate account suspension and forfeiture of pending earnings.",
  },
  {
    title: "5. Privacy Policy",
    content: "We collect and process your personal data in accordance with our Privacy Policy. This includes usage data, device information, and preferences. We use your data to personalize your experience and improve ad targeting (which increases your earnings). We do not sell your personal data to third parties without your consent.",
  },
  {
    title: "6. Intellectual Property",
    content: "All content on Banner.co, including the platform design, logos, and features, is the intellectual property of Banner.co Ltd. Advertiser content belongs to respective brand owners. Users may not reproduce, distribute, or create derivative works from platform content without prior written consent.",
  },
  {
    title: "7. Account Termination",
    content: "Banner.co reserves the right to terminate or suspend accounts that violate these terms, engage in fraudulent activity, or remain inactive for more than 12 months. Users may delete their accounts at any time from Settings. Data will be permanently removed within 30 days of deletion request.",
  },
  {
    title: "8. Limitation of Liability",
    content: "Banner.co is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you for any claims arising from these terms shall not exceed the total earnings in your account at the time of the claim.",
  },
  {
    title: "9. Governing Law",
    content: "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be resolved through binding arbitration in Lagos, Nigeria, unless prohibited by applicable law.",
  },
  {
    title: "10. Contact",
    content: "For questions about these terms, contact us at legal@banner.co or write to: Banner.co Ltd., 14 Victoria Island Road, Lagos, Nigeria. Last updated: May 2026.",
  },
];

const TermsPolicies: React.FC = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <SettingsSubLayout title="Terms & Policies">
      {/* Doc header */}
      <div className="bg-surface rounded-3xl border border-border-subtle p-6">
        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Legal Document</p>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
          Terms of Service<span className="text-primary">.</span>
        </h2>
        <p className="text-xs text-text-sub mt-1">Effective: May 1, 2026 · Version 3.2</p>
      </div>

      {/* Sections */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {sections.map((section, i) => (
          <div key={i} className="px-5 py-5">
            <h3 className="text-xs font-black text-text-main uppercase tracking-tight mb-2">
              {section.title}
            </h3>
            <p className="text-sm text-text-sub leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Accept */}
      <div className="bg-surface rounded-3xl border border-border-subtle p-5">
        <button
          onClick={() => setAccepted((p) => !p)}
          className="flex items-start gap-3 text-left w-full"
        >
          <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${accepted ? "bg-primary border-primary" : "border-border-subtle"}`}>
            {accepted && <span className="text-white text-[10px] font-black">✓</span>}
          </div>
          <p className="text-xs text-text-sub leading-snug">
            I have read and agree to the Banner.co Terms of Service and Privacy Policy.
          </p>
        </button>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-surface border border-border-subtle rounded-2xl text-[10px] font-black text-primary uppercase tracking-wider hover:border-primary/30">
          Privacy Policy
        </button>
        <button className="flex-1 py-3 bg-surface border border-border-subtle rounded-2xl text-[10px] font-black text-primary uppercase tracking-wider hover:border-primary/30">
          Cookie Policy
        </button>
      </div>
    </SettingsSubLayout>
  );
};

export default TermsPolicies;
