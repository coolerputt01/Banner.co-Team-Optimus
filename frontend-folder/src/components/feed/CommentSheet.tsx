import React, { useState, useRef, useEffect } from "react";
import { Heart, Send, MoreHorizontal, ChevronDown } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "c1",
    username: "alex_vibe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format",
    text: "This ad is absolutely 🔥 I already bought it after watching!",
    timestamp: "2m ago",
    likes: 142,
    isLiked: true,
    replies: [
      {
        id: "c1r1",
        username: "brand_official",
        avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&auto=format",
        text: "Thanks so much! We hope you love it 💙",
        timestamp: "1m ago",
        likes: 23,
        isLiked: false,
      },
    ],
  },
  {
    id: "c2",
    username: "sarah_j",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&auto=format",
    text: "The quality looks amazing. Anyone tried this IRL?",
    timestamp: "5m ago",
    likes: 87,
    isLiked: false,
  },
  {
    id: "c3",
    username: "k_dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format",
    text: "Earned ₦50 watching this 😂 Banner.co is goated",
    timestamp: "12m ago",
    likes: 310,
    isLiked: false,
  },
  {
    id: "c4",
    username: "urban_fox",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format",
    text: "When's the next drop? I need that limited edition colour 🤩",
    timestamp: "18m ago",
    likes: 65,
    isLiked: false,
  },
  {
    id: "c5",
    username: "jace_vfx",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format",
    text: "The cinematography in this ad is insane. What camera was used?",
    timestamp: "30m ago",
    likes: 201,
    isLiked: false,
  },
];

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalComments: number;
}

const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({
  comment,
  isReply = false,
}) => {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-2" : ""}`}>
      <img
        src={comment.avatar}
        alt={comment.username}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-xs font-black text-text-main uppercase tracking-tight">
              {comment.username}
            </span>
            <span className="text-[10px] text-text-sub ml-2">{comment.timestamp}</span>
            <p className="text-sm text-text-main mt-0.5 leading-snug">{comment.text}</p>
            <div className="flex items-center gap-4 mt-1.5">
              <button
                onClick={() => {
                  setLiked((p) => !p);
                  setLikes((p) => (liked ? p - 1 : p + 1));
                }}
                className="text-[10px] font-black text-text-sub hover:text-primary transition-colors uppercase tracking-wider"
              >
                Like
              </button>
              <button className="text-[10px] font-black text-text-sub hover:text-primary transition-colors uppercase tracking-wider">
                Reply
              </button>
              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies((p) => !p)}
                  className="text-[10px] font-black text-primary uppercase tracking-wider"
                >
                  {showReplies ? "Hide" : `View ${comment.replies.length} repl${comment.replies.length === 1 ? "y" : "ies"}`}
                </button>
              )}
            </div>
            {showReplies && comment.replies?.map((r) => (
              <CommentItem key={r.id} comment={r} isReply />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <button onClick={() => { setLiked((p) => !p); setLikes((p) => (liked ? p - 1 : p + 1)); }}>
              <Heart
                className={`h-4 w-4 transition-all ${liked ? "text-red-500 fill-red-500 scale-110" : "text-text-sub"}`}
              />
            </button>
            <span className="text-[10px] text-text-sub font-bold">{likes >= 1000 ? `${(likes/1000).toFixed(1)}k` : likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommentSheet: React.FC<CommentSheetProps> = ({
  isOpen,
  onClose,
  totalComments,
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-2xl bg-main-bg rounded-t-[32px] border-t border-x border-border-subtle shadow-2xl flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        {/* Handle + header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-subtle absolute top-3 left-1/2 -translate-x-1/2" />
          <h3 className="text-sm font-black text-text-main uppercase tracking-tight">
            {totalComments.toLocaleString()} Comments
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface rounded-full transition-colors">
              <MoreHorizontal className="h-4 w-4 text-text-sub" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-full transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-text-sub" />
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5">
          {mockComments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border-subtle flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format"
            alt="You"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full h-10 bg-surface rounded-full px-4 pr-10 text-sm text-text-main placeholder:text-text-sub outline-none border border-border-subtle focus:border-primary transition-colors"
              onKeyDown={(e) => e.key === "Enter" && text && setText("")}
            />
            {text && (
              <button
                onClick={() => setText("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Send className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom safe area */}
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </div>
  );
};
