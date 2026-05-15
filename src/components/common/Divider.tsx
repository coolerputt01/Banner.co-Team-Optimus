import React from "react";

interface DividerProps {
  text: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        {text}
      </span>
      <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
    </div>
  );
};
