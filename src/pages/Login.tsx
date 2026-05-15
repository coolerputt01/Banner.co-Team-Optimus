import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "@/components/auth/AUthHeader";
import { AuthInput } from "@/components/auth/AUthInput";
import { PasswordInput } from "@/components/auth/PassswordInput";
import { TermsText } from "@/components/common/TermsText";

interface FormErrors {
  identifier?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) navigate("/feed");
  };

  return (
    <div className="min-h-screen w-full bg-main-bg flex items-center justify-center overflow-x-hidden font-sans transition-colors duration-300">
      {/* Background decoration */}
      <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Card wrapper */}
      <div className="w-full md:max-w-3xl lg:max-w-4xl min-h-screen md:min-h-[640px] flex flex-col md:flex-row bg-main-bg md:bg-surface/50 md:backdrop-blur-2xl md:border md:border-border-subtle md:rounded-[40px] md:shadow-2xl overflow-hidden relative z-10">

        {/* Left brand panel — desktop only */}
        <div className="hidden md:flex flex-1 bg-primary p-10 lg:p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-10 right-[-20%] rotate-90 text-[12rem] font-black text-black/5 select-none pointer-events-none leading-none">
            BANNER
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-black leading-none tracking-tighter">
              EARN
              <br />
              WHILE
              <br />
              WATCHING<span className="opacity-50">.</span>
            </h1>
          </div>
          <div className="relative z-10">
            <p className="text-black font-bold text-lg max-w-[240px] leading-snug">
              Join 50,000+ creators and earners on the new frontier of advertising.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col w-full bg-main-bg">
          <AuthHeader title="LOGIN" onBack={() => navigate(-1)} />

          <main className="flex-1 flex flex-col px-6 sm:px-8 lg:px-12 pt-8 lg:pt-14 pb-10">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-black text-text-main italic tracking-tighter uppercase">
                Welcome Back<span className="text-primary">.</span>
              </h2>
              <p className="text-text-sub font-medium mt-1">
                Log in to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <AuthInput
                id="identifier"
                name="identifier"
                label="USERNAME / EMAIL"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Enter username or email"
                autoComplete="username"
                inputMode="email"
                error={errors.identifier}
              />

              <div className="space-y-1">
                <PasswordInput
                  id="password"
                  name="password"
                  label="PASSWORD"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={errors.password}
                />
                <button
                  type="button"
                  className="text-[10px] font-black text-text-sub/60 hover:text-primary uppercase tracking-widest transition-colors ml-1"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button type="submit" className="relative w-full h-14 group mt-2">
                <div className="absolute inset-0 bg-primary rounded-xl translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <div className="absolute inset-0 bg-text-primary dark:bg-white rounded-xl flex items-center justify-center border border-transparent active:scale-[0.98] transition-all">
                  <span className="text-main-bg dark:text-black font-black text-lg tracking-tight">
                    LOG IN
                  </span>
                </div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-sub font-bold uppercase">
                New to Banner?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-primary font-black hover:underline tracking-tight"
                >
                  Sign Up
                </button>
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-border-subtle">
              <TermsText />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;
