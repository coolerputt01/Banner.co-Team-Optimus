import React, { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  error,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[10px] font-black text-text-sub uppercase tracking-[0.2em] ml-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`input-field pr-12 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub/40 hover:text-text-main transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-bold ml-1">{error}</p>
      )}
    </div>
  );
};
