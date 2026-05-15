import React, { useState, useEffect, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import { BrandInfo } from "./BrandInfo";
import { ActionRail } from "./ActionRail";
import { Ad } from "../../types/feed";
import { EarningsBadge } from "./EarningBadge";
import { CommentSheet } from "./CommentSheet";
import { ChatPanel } from "./ChatPanel";
import { ShareModal } from "./ShareModal";

interface VideoCardProps {
  ad: Ad;
  isActive: boolean;
  onAvatarClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  ad,
  isActive,
  onAvatarClick,
}) => {
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pause timer when any overlay is open
  const overlayOpen = showComments || showChat || showShare;

  useEffect(() => {
    setProgress(0);
  }, [ad.id]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isActive && !overlayOpen) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
      }, 150);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, overlayOpen]);

  const rail = (
    <ActionRail
      brandAvatar={ad.brand.avatar}
      stats={ad.stats}
      onAvatarClick={onAvatarClick}
      onComment={() => setShowComments(true)}
      onChat={() => setShowChat(true)}
      onShare={() => setShowShare(true)}
    />
  );

  return (
    <>
      <div className="flex flex-row items-end h-full w-full gap-4 lg:gap-6 px-0 lg:px-4">
        {/* ── Video frame ── */}
        <div className="relative flex-1 h-full bg-zinc-950 lg:rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
          <ProgressBar progress={progress} />

          <img
            src={ad.content.thumbnail}
            className="h-full w-full object-cover"
            alt={ad.content.headline}
            loading="lazy"
          />

          {/* Gradient overlay + info */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-5 lg:p-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
            <BrandInfo brand={ad.brand} />
            <p className="text-white text-sm lg:text-xl font-bold mt-1 mb-4 line-clamp-2 max-w-[75%]">
              {ad.content.headline}
            </p>
            <EarningsBadge amount={ad.earnings} />
          </div>

          {/* Mobile action rail */}
          <div className="lg:hidden absolute right-3 bottom-28 z-30">
            {rail}
          </div>
        </div>

        {/* Desktop action rail */}
        <div className="hidden lg:flex flex-col justify-end pb-12">
          <div className="bg-zinc-900/30 backdrop-blur-xl p-4 rounded-full border border-white/5">
            {rail}
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CommentSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        totalComments={ad.stats.comments}
      />
      <ChatPanel
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        brandName={ad.brand.name}
        brandAvatar={ad.brand.avatar}
      />
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        adTitle={ad.content.headline}
        adUrl={`https://banner.co/ad/${ad.id}`}
      />
    </>
  );
};
