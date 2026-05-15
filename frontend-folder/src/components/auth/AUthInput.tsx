import React, { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  id,
  error,
  ...props
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="block text-[10px] font-black text-text-sub uppercase tracking-[0.2em] ml-1"
    >
      {label}
    </label>
    <input
      id={id}
      className={`input-field ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
      {...props}
    />
    {error && (
      <p className="text-xs text-red-500 font-bold ml-1">{error}</p>
    )}
  </div>
);
