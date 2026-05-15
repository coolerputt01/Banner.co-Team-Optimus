import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Heart, Send } from "lucide-react";
import { Story } from "@/types/inbox";

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  const story = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((p) => p + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 100 / (STORY_DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  // Reset progress on story change
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  if (!story) return null;

  // Fake story background images for demo
  const storyBgs = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format",
    "https://images.unsplash.com/photo-1611339555312-f607c0842fd1?w=600&auto=format",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format",
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format",
  ];

  const bg = storyBgs[currentIndex % storyBgs.length];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Story card */}
      <div
        className="relative w-full h-full max-w-sm mx-auto"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background image */}
        <img
          src={bg}
          alt="story"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-20">
          {stories.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                      ? `${progress}%`
                      : "0%",
                  transition: i === currentIndex ? "width 0.1s linear" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 px-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={story.avatar}
              alt={story.username}
              className="w-9 h-9 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="text-white text-sm font-black uppercase tracking-tight">
                {story.username}
              </p>
              <p className="text-white/60 text-[10px]">Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tap zones — left/right to navigate */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          onClick={goPrev}
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-10"
          onClick={goNext}
        />

        {/* Story content overlay */}
        <div className="absolute bottom-20 left-0 right-0 px-5 z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
            <p className="text-white text-sm font-bold leading-snug">
              ✨ Just earned ₦150 watching ads today on Banner.co!
              The grind is real 💰
            </p>
          </div>
        </div>

        {/* Like / actions */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-4">
          <button className="p-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Heart className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Reply input */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 z-20">
          <div className="flex items-center gap-3">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onClick={(e) => { e.stopPropagation(); setIsPaused(true); }}
              onBlur={() => setIsPaused(false)}
              placeholder={`Reply to ${story.username}...`}
              className="flex-1 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40 transition-colors"
            />
            {replyText && (
              <button
                onClick={() => setReplyText("")}
                className="w-11 h-11 rounded-full bg-primary flex items-center justify-center"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar nav arrows (desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 hidden sm:flex w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 hidden sm:flex w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
