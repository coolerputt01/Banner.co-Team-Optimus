import React from "react";
import { Verified } from "lucide-react";
import { Brand } from "@/types/feed";

interface BrandInfoProps {
  brand: Brand;
}

export const BrandInfo: React.FC<BrandInfoProps> = ({ brand }) => {
  return (
    <div className="flex items-center gap-1 mb-2">
      <span className="font-bold text-lg text-white">{brand.username}</span>
      {brand.verified && (
        <Verified className="h-4 w-4 text-primary fill-current" />
      )}
    </div>
  );
};
