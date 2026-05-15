import React from "react";
import { Eye, Bookmark } from "lucide-react";
import { BookmarkedAd } from "../../types/user";

export const BookmarksGrid: React.FC<{
  bookmarks: BookmarkedAd[];
  onBookmarkClick?: (id: string) => void;
}> = ({ bookmarks, onBookmarkClick }) => {
  if (bookmarks.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Bookmark className="h-12 w-12 text-text-sub/20 mb-4" />
        <p className="text-text-sub font-black text-xs uppercase tracking-widest">
          Archive Empty
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((ad) => (
        <div
          key={ad.id}
          onClick={() => onBookmarkClick?.(ad.id)}
          className="bg-surface rounded-[24px] overflow-hidden border border-white/5 md:border-border-subtle dark:border-blue/10 group cursor-pointer transition-all hover:border-primary/40"
        >
          <div className="relative aspect-[4/3]">
            <img
              src={ad.thumbnail}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt=""
            />
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
              <span className="text-primary font-black text-[10px]">
                ₦{ad.earnings}
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-primary font-black text-[9px] italic uppercase tracking-tighter">
              {ad.brandName}
            </p>
            <p className="text-text-main text-[11px] font-black line-clamp-1 leading-tight mt-0.5 uppercase tracking-tight">
              {ad.headline}
            </p>
            <div className="flex items-center justify-between mt-3 opacity-40 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black text-text-sub uppercase">
                {ad.category}
              </span>
              <div className="flex items-center gap-1 text-[9px] font-black text-text-sub">
                <Eye className="h-3 w-3" />{" "}
                {ad.views >= 1000
                  ? (ad.views / 1000).toFixed(1) + "K"
                  : ad.views}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
