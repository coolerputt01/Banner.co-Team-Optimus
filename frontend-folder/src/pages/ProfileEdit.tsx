import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft, Check, User } from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Alex Johnson",
    username: "alexcreates",
    bio: "Watching ads, earning rewards 💰 | Digital creator | Banner.co enthusiast",
    website: "https://alexcreates.co",
    location: "Lagos, Nigeria",
  });

  const handleChange = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/user-profile");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/upload")}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-main-bg/95 backdrop-blur-md border-b border-border-subtle px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-lg font-black text-text-main italic uppercase tracking-tight flex-1 text-center">
            Edit Profile
          </h1>
          <button
            onClick={handleSave}
            className={`px-4 h-9 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white hover:brightness-110"
            }`}
          >
            {saved ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span> : "Save"}
          </button>
        </header>

        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-28 lg:pb-10 space-y-6">
          {/* Avatar + Cover */}
          <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
            {/* Cover */}
            <div className="relative h-32 bg-gradient-to-br from-primary/30 to-primary/10">
              <img
                src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format"
                alt="cover"
                className="w-full h-full object-cover"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-2">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </button>
            </div>

            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="relative -mt-10 w-20 h-20 rounded-full bg-primary border-4 border-surface flex items-center justify-center overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-[10px] text-text-sub font-black uppercase tracking-widest mt-3">
                Tap to change photo or cover
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="bg-surface rounded-3xl border border-border-subtle divide-y divide-border-subtle">
            {[
              { key: "name", label: "Full Name", placeholder: "Your name" },
              { key: "username", label: "Username", placeholder: "username", prefix: "@" },
              { key: "website", label: "Website", placeholder: "https://yoursite.com" },
              { key: "location", label: "Location", placeholder: "City, Country" },
            ].map((field) => (
              <div key={field.key} className="px-5 py-4">
                <label className="text-[10px] font-black text-text-sub uppercase tracking-widest block mb-1.5">
                  {field.label}
                </label>
                <div className="flex items-center gap-2">
                  {field.prefix && (
                    <span className="text-text-sub font-black text-sm">{field.prefix}</span>
                  )}
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 bg-transparent text-sm font-bold text-text-main outline-none placeholder:text-text-sub"
                  />
                </div>
              </div>
            ))}

            {/* Bio */}
            <div className="px-5 py-4">
              <label className="text-[10px] font-black text-text-sub uppercase tracking-widest block mb-1.5">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell your story..."
                maxLength={150}
                rows={3}
                className="w-full bg-transparent text-sm font-bold text-text-main outline-none resize-none placeholder:text-text-sub"
              />
              <p className="text-[10px] text-text-sub text-right mt-1">
                {form.bio.length}/150
              </p>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle">
              <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">
                Account
              </p>
            </div>
            <button
              onClick={() => navigate("/settings/manage-account")}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-colors"
            >
              <User className="h-5 w-5 text-text-sub" />
              <span className="text-sm font-black text-text-main uppercase tracking-tight">
                Manage Account
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileEdit;
