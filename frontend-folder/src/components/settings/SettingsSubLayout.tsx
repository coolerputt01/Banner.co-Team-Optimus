import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";

interface SettingsSubLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSubLayout: React.FC<SettingsSubLayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab="profile"
        onTabChange={() => {}}
        onUpload={() => navigate("/upload")}
      />
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-40 bg-main-bg/95 backdrop-blur-md border-b border-border-subtle px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-lg font-black text-text-main italic uppercase tracking-tight flex-1 text-center lg:text-left">
            {title}
          </h1>
          <div className="w-10 lg:hidden" />
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-28 lg:pb-10 space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
};
