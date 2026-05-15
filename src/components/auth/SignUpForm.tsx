import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SignUpFormProps, SignUpData } from "../../types/auth";
import { BirthdaySelector } from "./BirthdaySelector";

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onLoginClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpData | "birthday", string>>>({});
  const [formData, setFormData] = useState<SignUpData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    birthday: { month: "", day: "", year: "" },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof SignUpData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "At least 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "At least 8 characters";
    if (!formData.birthday.month || !formData.birthday.day || !formData.birthday.year)
      newErrors.birthday = "Please complete your date of birth";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit?.(formData);
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
      {/* Name & Username Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub ml-1">
            Full Name
          </label>
          <input
            name="fullName"
            className={`input-field ${errors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 font-bold ml-1">{errors.fullName}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub ml-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm pointer-events-none">
              @
            </span>
            <input
              name="username"
              className={`input-field pl-9 ${errors.username ? "border-red-500 focus:border-red-500" : ""}`}
              placeholder="username"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 font-bold ml-1">{errors.username}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub ml-1">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          className={`input-field ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
          placeholder="example@banner.co"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
          inputMode="email"
        />
        {errors.email && (
          <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub ml-1">
          Password
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className={`input-field pr-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub/50 hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 font-bold ml-1">{errors.password}</p>
        )}
      </div>

      {/* Birthday */}
      <div>
        <BirthdaySelector
          value={formData.birthday}
          onChange={(birthday) => {
            setFormData((prev) => ({ ...prev, birthday }));
            if (errors.birthday) setErrors((prev) => ({ ...prev, birthday: undefined }));
          }}
        />
        {errors.birthday && (
          <p className="text-xs text-red-500 font-bold ml-1 mt-1">{errors.birthday}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button type="submit" className="relative w-full h-14 group">
          <div className="absolute inset-0 bg-primary rounded-xl translate-x-1.5 translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 transition-all duration-200" />
          <div className="absolute inset-0 bg-text-primary dark:bg-white rounded-xl flex items-center justify-center border border-transparent shadow-xl">
            <span className="text-white dark:text-black font-black text-lg tracking-tight">
              CREATE ACCOUNT
            </span>
          </div>
        </button>

        <p className="mt-6 text-center text-[11px] font-black text-text-sub uppercase tracking-widest">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-primary hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </form>
  );
};
