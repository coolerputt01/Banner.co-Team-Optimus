// components/settings/ToggleItem.tsx
import { LucideIcon } from "lucide-react";

interface ToggleItemProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleItem({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: ToggleItemProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <Icon size={20} className="text-muted mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-primary">{label}</p>
        {description && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-primary-500" : "bg-default border border-default"
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
