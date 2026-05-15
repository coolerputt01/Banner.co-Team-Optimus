import React from "react";
import { useNavigate } from "react-router-dom";
import { MousePointerClick, Home } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-main-bg flex flex-col items-center justify-center px-6 font-sans">
      {/* Brand mark */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
        <MousePointerClick className="h-8 w-8" />
      </div>

      {/* Error code */}
      <p className="text-[120px] sm:text-[160px] font-black text-text-main/5 leading-none select-none italic tracking-tighter">
        404
      </p>

      {/* Message */}
      <div className="text-center -mt-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-text-main italic uppercase tracking-tighter mb-3">
          Page Not Found<span className="text-primary">.</span>
        </h1>
        <p className="text-text-sub font-medium max-w-xs mx-auto">
          This page doesn't exist or was moved. Head back to the feed to keep earning.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/feed")}
        className="relative h-14 px-10 group"
      >
        <div className="absolute inset-0 bg-primary rounded-xl translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
        <div className="absolute inset-0 bg-text-primary dark:bg-white rounded-xl flex items-center justify-center gap-2">
          <Home className="h-5 w-5 text-main-bg dark:text-black" />
          <span className="text-main-bg dark:text-black font-black text-sm tracking-tight uppercase">
            Back to Feed
          </span>
        </div>
      </button>
    </div>
  );
};

export default NotFound;
