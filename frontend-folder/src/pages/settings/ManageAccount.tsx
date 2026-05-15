import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { Camera, Mail, Phone, Trash2, AlertCircle } from "lucide-react";

const ManageAccount: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("+234 812 345 6789");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSubLayout title="Manage Account">
      {/* Avatar */}
      <div className="bg-surface rounded-3xl border border-border-subtle p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-surface flex items-center justify-center">
            <Camera className="h-3 w-3 text-white" />
          </button>
        </div>
        <div>
          <p className="font-black text-text-main uppercase tracking-tight">Alex Johnson</p>
          <p className="text-xs text-text-sub">@alexcreates · Joined Jan 2024</p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="mt-2 text-[10px] font-black text-primary uppercase tracking-wider"
          >
            Edit Profile →
          </button>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Personal Information</p>
        </div>
        {[
          { label: "Full Name", value: name, setter: setName, icon: null },
          { label: "Email", value: email, setter: setEmail, icon: <Mail className="h-4 w-4 text-text-sub" /> },
          { label: "Phone", value: phone, setter: setPhone, icon: <Phone className="h-4 w-4 text-text-sub" /> },
        ].map(({ label, value, setter, icon }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle last:border-0">
            {icon}
            <div className="flex-1">
              <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-0.5">{label}</p>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="bg-transparent text-sm font-bold text-text-main outline-none w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Change password */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Change Password</p>
        </div>
        {[
          { label: "Current Password", value: currentPassword, setter: setCurrentPassword },
          { label: "New Password", value: newPassword, setter: setNewPassword },
          { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword },
        ].map(({ label, value, setter }) => (
          <div key={label} className="px-5 py-4 border-b border-border-subtle last:border-0">
            <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-0.5">{label}</p>
            <input
              type="password"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent text-sm font-bold text-text-main outline-none w-full placeholder:text-text-sub/40"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:brightness-110"
        }`}
      >
        {saved ? "✓ Changes Saved!" : "Save Changes"}
      </button>

      {/* Danger zone */}
      <div className="bg-surface rounded-3xl border border-red-500/20 overflow-hidden">
        <div className="px-5 py-3 border-b border-red-500/20">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5" /> Danger Zone
          </p>
        </div>
        <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-500/5 transition-colors text-left">
          <Trash2 className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-black text-red-500 uppercase tracking-tight">Delete Account</p>
            <p className="text-[10px] text-text-sub mt-0.5">Permanently delete your account and all data</p>
          </div>
        </button>
      </div>
    </SettingsSubLayout>
  );
};

export default ManageAccount;
