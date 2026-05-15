import React from "react";
import { MousePointerClick } from "lucide-react";

export const SplashLogo: React.FC = () => {
  return (
    <div className="mb-6 flex flex-col items-center lg:items-start lg:mb-0">
      {/* Brand Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 lg:h-24 lg:w-24">
        <MousePointerClick className="h-10 w-10 fill-current lg:h-12 lg:w-12" />
      </div>

      {/* Brand Name */}
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Banner<span className="text-primary">.co</span>
      </h1>

      {/* Tagline */}
      <p className="mt-4 max-w-[280px] text-xl font-medium leading-tight text-white/90 sm:max-w-md sm:text-2xl lg:text-3xl text-center lg:text-left">
        Watch Ads. <br className="hidden lg:block" /> Get Paid.
      </p>
    </div>
  );
};
