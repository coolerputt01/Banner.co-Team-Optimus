import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeMode } from "@/types/settingsType";

interface AppearanceOptionConfig {
  mode: ThemeMode;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

const options: AppearanceOptionConfig[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "System", Icon: Monitor },
];

export const SettingsAppearance: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mt-8">
      <h3 className="text-text-sub text-[11px] font-black tracking-[0.25em] px-5 pb-3 uppercase">
        Appearance
      </h3>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-text-main text-sm font-black italic uppercase">
            Theme
          </p>
          <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-black uppercase border border-primary/20">
            {theme}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className="flex flex-col items-center gap-2 group"
              aria-label={`Set ${label} theme`}
            >
              <div
                className={`w-full aspect-[4/5] rounded-xl border-2 transition-all flex items-center justify-center ${
                  theme === mode
                    ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(29,161,242,0.2)]"
                    : "border-border-subtle bg-main-bg hover:border-primary/30"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    theme === mode ? "text-primary" : "text-text-sub group-hover:text-text-main"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  theme === mode ? "text-primary" : "text-text-sub"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
