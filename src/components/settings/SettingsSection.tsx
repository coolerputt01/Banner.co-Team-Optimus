import React from "react";
import { SettingsItem as SettingsItemType } from "@/types/settingsType";
import { SettingsItem } from "./SettingsItems";

interface SettingsSectionProps {
  title: string;
  items: SettingsItemType[];
  onItemClick?: (itemId: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
  onItemClick,
}) => {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-text-sub text-[11px] font-black tracking-[0.25em] px-1 pb-3 uppercase">
        {title}
      </h3>
      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {items.map((item) => (
          <SettingsItem
            key={item.id}
            {...item}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
