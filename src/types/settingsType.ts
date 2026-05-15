export type ThemeMode = "light" | "dark" | "system";

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  id: string;
  icon: string;
  label: string;
  type: "link" | "toggle" | "select";
  value?: string;
  action?: () => void;
  href?: string;
}

export interface AppearanceOption {
  mode: ThemeMode;
  icon: string;
  label: string;
  preview: string;
}
