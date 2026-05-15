import React from "react";
import { BirthdayOption } from "../../types/auth";

interface BirthdaySelectorProps {
  value?: { month: string; day: string; year: string };
  onChange?: (birthday: { month: string; day: string; year: string }) => void;
}

const months: BirthdayOption[] = [
  { value: "01", label: "Jan" }, { value: "02", label: "Feb" },
  { value: "03", label: "Mar" }, { value: "04", label: "Apr" },
  { value: "05", label: "May" }, { value: "06", label: "Jun" },
  { value: "07", label: "Jul" }, { value: "08", label: "Aug" },
  { value: "09", label: "Sep" }, { value: "10", label: "Oct" },
  { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
];

const days: BirthdayOption[] = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1).padStart(2, "0"),
}));

const currentYear = new Date().getFullYear();
const years: BirthdayOption[] = Array.from({ length: 100 }, (_, i) => {
  const y = currentYear - i;
  return { value: String(y), label: String(y) };
});

const selectClass =
  "w-full h-14 bg-light-surface dark:bg-dark-surface border border-slate-200 dark:border-white/5 rounded-xl px-3 outline-none transition-all text-light-text-primary dark:text-dark-text-primary focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-sm";

export const BirthdaySelector: React.FC<BirthdaySelectorProps> = ({
  value = { month: "", day: "", year: "" },
  onChange,
}) => {
  const handleChange = (field: "month" | "day" | "year", val: string) => {
    onChange?.({ ...value, [field]: val });
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub ml-1 block">
        Date of Birth
      </label>
      <div className="grid grid-cols-3 gap-2">
        <select
          value={value.month}
          onChange={(e) => handleChange("month", e.target.value)}
          className={selectClass}
          aria-label="Birth month"
        >
          <option value="" disabled>Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={value.day}
          onChange={(e) => handleChange("day", e.target.value)}
          className={selectClass}
          aria-label="Birth day"
        >
          <option value="" disabled>Day</option>
          {days.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <select
          value={value.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className={selectClass}
          aria-label="Birth year"
        >
          <option value="" disabled>Year</option>
          {years.map((y) => (
            <option key={y.value} value={y.value}>{y.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
