// components/settings/ThemeOption.tsx
import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ThemeOptionProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function ThemeOption({
  icon: Icon,
  label,
  selected,
  onClick,
}: ThemeOptionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 flex-1"
    >
      <div
        className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center transition-colors relative ${
          selected
            ? "border-primary-500 bg-primary-500/10"
            : "border-default bg-card hover:bg-default"
        }`}
      >
        <Icon
          size={24}
          className={selected ? "text-primary-500" : "text-muted"}
        />
        {selected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>
      <span
        className={`text-xs ${selected ? "text-primary font-medium" : "text-muted"}`}
      >
        {label}
      </span>
    </button>
  );
}
