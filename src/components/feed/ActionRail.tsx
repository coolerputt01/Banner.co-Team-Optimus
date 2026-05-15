import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, MessageSquare } from "lucide-react";

interface ActionRailProps {
  brandAvatar: string;
  stats: {
    likes: number;
    comments: number;
    bookmarks: number;
    shares: number;
  };
  onAvatarClick?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onChat?: () => void;
}

export const ActionRail: React.FC<ActionRailProps> = ({
  brandAvatar,
  stats,
  onAvatarClick,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onChat,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [bookmarkCount, setBookmarkCount] = useState(stats.bookmarks);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    if (liked) {
      setLikeCount((p) => p - 1);
    } else {
      setLikeCount((p) => p + 1);
    }
    setLiked((p) => !p);
    onLike?.();
  };

  const handleBookmark = () => {
    setBookmarkCount((p) => (bookmarked ? p - 1 : p + 1));
    setBookmarked((p) => !p);
    onBookmark?.();
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      {/* Brand Avatar */}
      <div
        className="relative mb-1 md:mb-2 cursor-pointer"
        onClick={onAvatarClick}
      >
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-white overflow-hidden bg-primary flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg">
          {brandAvatar.charAt(0).toUpperCase()}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center">
          <span className="text-white text-[8px] font-black">+</span>
        </div>
      </div>

      {/* LIKE */}
      <button
        className="flex flex-col items-center group"
        onClick={handleLike}
        aria-label="Like"
      >
        <div
          className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
            liked
              ? "bg-red-500/20 scale-110"
              : "bg-white/10 group-hover:bg-white/20"
          } ${isAnimating ? "scale-125" : ""}`}
        >
          <Heart
            className={`h-5 w-5 md:h-7 md:w-7 transition-all duration-200 ${
              liked ? "text-red-500 fill-red-500 scale-110" : "text-white"
            }`}
          />
        </div>
        <span className={`text-[10px] md:text-xs font-bold mt-1 transition-colors ${liked ? "text-red-400" : "text-white"}`}>
          {formatCount(likeCount)}
        </span>
      </button>

      {/* CHAT */}
      <button
        className="flex flex-col items-center group"
        onClick={onChat}
        aria-label="Chat"
      >
        <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <MessageSquare className="h-5 w-5 md:h-7 md:w-7 text-white" />
        </div>
        <span className="text-[10px] md:text-xs font-bold text-white mt-1 uppercase tracking-wider">
          Chat
        </span>
      </button>

      {/* COMMENT */}
      <button className="flex flex-col items-center group" onClick={onComment} aria-label="Comment">
        <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <MessageCircle className="h-5 w-5 md:h-7 md:w-7 text-white fill-white" />
        </div>
        <span className="text-[10px] md:text-xs font-bold text-white mt-1">
          {formatCount(stats.comments)}
        </span>
      </button>

      {/* BOOKMARK */}
      <button className="flex flex-col items-center group" onClick={handleBookmark} aria-label="Bookmark">
        <div
          className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all ${
            bookmarked ? "bg-primary/20" : "bg-white/10 group-hover:bg-white/20"
          }`}
        >
          <Bookmark
            className={`h-5 w-5 md:h-7 md:w-7 transition-all ${
              bookmarked ? "text-primary fill-primary" : "text-white fill-white"
            }`}
          />
        </div>
        <span className={`text-[10px] md:text-xs font-bold mt-1 ${bookmarked ? "text-primary" : "text-white"}`}>
          {formatCount(bookmarkCount)}
        </span>
      </button>

      {/* SHARE */}
      <button className="flex flex-col items-center group" onClick={onShare} aria-label="Share">
        <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <Share2 className="h-5 w-5 md:h-7 md:w-7 text-white" />
        </div>
        <span className="text-[10px] md:text-xs font-bold text-white mt-1 uppercase tracking-wider">
          Share
        </span>
      </button>
    </div>
  );
};
