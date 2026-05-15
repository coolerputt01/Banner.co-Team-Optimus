import React from "react";
import {
  ChevronRight,
  Lock,
  ShieldCheck,
  User,
  Settings2,
  Clock,
  Download,
  Trash2,
  Zap,
  Globe,
  Languages,
  CreditCard,
  Wallet,
  FileText,
  EyeOff,
  HelpCircle,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { SettingsItem as SettingsItemType } from "@/types/settingsType";

interface SettingsItemProps extends SettingsItemType {
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  // Account Section
  person: <User className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  shield_person: <ShieldCheck className="h-5 w-5" />,

  // Content & Activity
  tune: <Settings2 className="h-5 w-5" />,
  schedule: <Clock className="h-5 w-5" />,
  download_for_offline: <Download className="h-5 w-5" />,

  // Cache & Cellular
  delete_sweep: <Trash2 className="h-5 w-5" />,
  speed: <Zap className="h-5 w-5" />,

  // Language & Region
  language: <Globe className="h-5 w-5" />,
  translate: <Languages className="h-5 w-5" />,

  // Wallet Settings (Using text-primary for emphasis)
  payments: <CreditCard className="h-5 w-5 text-primary" />,
  account_balance_wallet: <Wallet className="h-5 w-5 text-primary" />,
  description: <FileText className="h-5 w-5 text-primary" />,
  visibility_off: <EyeOff className="h-5 w-5 text-primary" />,

  // Support
  help: <HelpCircle className="h-5 w-5" />,
  report: <AlertTriangle className="h-5 w-5" />,
  gavel: <Scale className="h-5 w-5" />,
};

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  label,
  value,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-5 min-h-[64px] py-4 hover:bg-primary/5 active:bg-primary/10 transition-all cursor-pointer group"
    >
      {/* ICON WRAPPER */}
      <div className="text-text-sub group-hover:text-primary transition-colors duration-200">
        {iconMap[icon] || <Settings2 className="h-5 w-5" />}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col flex-1 justify-center">
        <p className="text-text-main text-sm font-black italic tracking-tight uppercase">
          {label}
        </p>
      </div>

      {/* RIGHT SIDE ACCESSORIES */}
      <div className="flex items-center gap-2">
        {value && (
          <span className="text-[10px] font-black text-primary/90 bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-primary/10">
            {value}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-text-sub/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
