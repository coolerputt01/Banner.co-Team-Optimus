import React from "react";
import { Eye, Share2, TrendingUp } from "lucide-react";
import { BookmarkedAd, SharedAd } from "../../types/user";

interface ActivityListProps {
  bookmarks?: BookmarkedAd[];
  shares?: SharedAd[];
  type: "bookmarks" | "shared" | "earnings";
}

export const ActivityList: React.FC<ActivityListProps> = ({
  bookmarks = [],
  shares = [],
  type,
}) => {
  if (type === "bookmarks") {
    if (bookmarks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-text-sub text-xs font-black uppercase tracking-widest">
            No activity yet
          </p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-border-subtle">
        {bookmarks.map((ad) => (
          <div key={ad.id} className="flex items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface flex-shrink-0">
              <img src={ad.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-black text-text-main uppercase tracking-tight">
                  {ad.brandName}
                </span>
                <span className="text-[10px] text-text-sub">·</span>
                <span className="text-[10px] text-text-sub">{ad.category}</span>
              </div>
              <p className="text-xs text-text-sub line-clamp-1">{ad.headline}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-text-sub">
                  <Eye className="h-3 w-3" />
                  <span>{ad.views >= 1000 ? `${(ad.views / 1000).toFixed(1)}K` : ad.views}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-coral">
                  <TrendingUp className="h-3 w-3" />
                  <span>₦{ad.earnings}</span>
                </div>
                <span className="text-[10px] text-text-sub">
                  {new Date(ad.bookmarkedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "shared") {
    if (shares.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-text-sub text-xs font-black uppercase tracking-widest">
            Nothing shared yet
          </p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-border-subtle">
        {shares.map((share) => (
          <div key={share.id} className="flex items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface flex-shrink-0">
              <img src={share.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-text-main uppercase tracking-tight">
                {share.brandName}
              </p>
              <p className="text-xs text-text-sub mt-0.5">
                Shared to {share.platform} · {new Date(share.sharedAt).toLocaleDateString()}
              </p>
            </div>
            <Share2 className="h-4 w-4 text-text-sub flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};
