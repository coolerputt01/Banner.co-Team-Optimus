import React from "react";
import { useNavigate } from "react-router-dom";
import { ProfilePhotoUpload } from "../components/auth/ProfilePhotoUpload";
import { SignUpForm } from "../components/auth/SignUpForm";
import { TermsText } from "../components/common/TermsText";
import { AuthHeader } from "@/components/auth/AUthHeader";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-main-bg flex items-center justify-center overflow-x-hidden font-sans transition-colors">
      {/* Background decoration */}
      <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-coral/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Card */}
      <div className="w-full md:max-w-3xl lg:max-w-4xl min-h-screen md:min-h-[700px] flex flex-col md:flex-row bg-main-bg md:bg-surface/50 md:backdrop-blur-2xl md:border md:border-border-subtle md:rounded-[40px] md:shadow-2xl overflow-hidden relative z-10">

        {/* Left brand panel — desktop only */}
        <div className="hidden md:flex flex-1 bg-primary p-10 lg:p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 rotate-90 text-[12rem] font-black text-black/5 select-none pointer-events-none leading-none">
            CREATE
          </div>
          <h1 className="text-5xl font-black text-black leading-none tracking-tighter relative z-10">
            START
            <br />
            EARNING
            <br />
            TODAY<span className="opacity-50">.</span>
          </h1>
          <p className="text-black font-bold text-lg max-w-[260px] relative z-10 leading-snug">
            Join the community of modern advertisers.
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col w-full bg-main-bg overflow-y-auto no-scrollbar">
          <AuthHeader title="SIGN UP" onBack={() => navigate(-1)} />

          <main className="flex-1 flex flex-col px-6 sm:px-8 lg:px-12 pt-6 pb-10">
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-black text-text-main italic tracking-tighter">
                GET STARTED<span className="text-primary">.</span>
              </h2>
              <p className="text-text-sub font-medium mt-1">
                It only takes a minute.
              </p>
            </div>

            {/* Avatar upload */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <ProfilePhotoUpload onPhotoChange={(f) => console.log(f)} />
            </div>

            {/* Form */}
            <SignUpForm
              onSubmit={(d) => {
                console.log(d);
                navigate("/feed");
              }}
              onLoginClick={() => navigate("/login")}
            />

            <div className="mt-8 pt-6 border-t border-border-subtle">
              <TermsText />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
