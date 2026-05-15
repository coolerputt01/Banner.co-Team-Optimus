import React from "react";

interface TermsTextProps {
  className?: string;
}

export const TermsText: React.FC<TermsTextProps> = ({ className = "" }) => {
  return (
    <p
      className={`text-center text-[10px] text-text-sub px-4 leading-relaxed ${className}`}
    >
      By signing up, you agree to our{" "}
      <a href="#" className="underline hover:text-primary transition-colors">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#" className="underline hover:text-primary transition-colors">
        Privacy Policy
      </a>
      .
    </p>
  );
};
