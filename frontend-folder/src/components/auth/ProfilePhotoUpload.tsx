import React, { useState, useRef } from "react";
import { Camera, Plus } from "lucide-react";
import { ProfilePhotoUploadProps } from "../../types/auth";

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onPhotoChange,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onPhotoChange?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className={`w-28 h-28 rounded-[32px] flex items-center justify-center border-2 border-dashed overflow-hidden transition-all duration-300
          ${preview ? "border-primary" : "border-text-sub/20 bg-surface group-hover:border-primary/50"}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover shadow-2xl"
            />
          ) : (
            <Camera className="h-10 w-10 text-text-sub/40 group-hover:text-primary transition-colors" />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary text-white dark:text-black p-2 rounded-xl shadow-xl border-4 border-main-bg group-hover:scale-110 transition-transform">
          <Plus className="h-4 w-4 stroke-[3px]" />
        </div>
      </div>
      <span className="mt-4 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
        Upload Avatar
      </span>
      {error && (
        <p className="text-xs text-coral mt-2 font-bold uppercase">{error}</p>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
