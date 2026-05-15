import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { VideoCard } from "@/components/feed/VideoCard";
import { Navigation } from "@/components/navigation/Navigation";
import { SearchBar } from "@/components/common/SearchBar";
import { Ad } from "@/types/feed";
import feedData from "@/data/feed.json";

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<Ad[]>(feedData.ads as Ad[]);
  const [activeTab, setActiveTab] = useState<"forYou" | "explore">("forYou");
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("feed");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMoreAds = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (page < 5) {
      const nextBatch = (feedData.ads as Ad[]).map((ad) => ({
        ...ad,
        id: `${ad.id}-p${page}-${Math.random().toString(36).slice(2)}`,
      }));
      setAds((prev) => [...prev, ...nextBatch]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
    loadingRef.current = false;
  }, [page, hasMore]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollTop, clientHeight, scrollHeight } = el;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);

    if (scrollHeight - scrollTop - clientHeight < 300) {
      loadMoreAds();
    }
  }, [currentIndex, loadMoreAds]);

  return (
    <div className="h-screen w-full bg-main-bg flex overflow-hidden font-sans transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/upload")}
      />

      {/* Main feed area — offset by sidebar on desktop */}
      <main className="flex-1 flex flex-col relative h-full lg:ml-64">
        {/* Mobile header — floats above feed */}
        <div className="absolute top-0 left-0 right-0 z-30 lg:hidden px-4 pt-safe-top pt-4">
          <FeedHeader
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t)}
          />
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 z-30 px-6 pt-6">
          <FeedHeader
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t)}
          />
        </div>

        {/* Scrollable feed */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        >
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              /* Mobile: full viewport minus bottom nav (76px). Desktop: full viewport */
              className="h-[calc(100dvh-76px)] lg:h-screen w-full snap-start flex justify-center items-center lg:py-8"
            >
              <VideoCard ad={ad} isActive={index === currentIndex} />
            </div>
          ))}

          {isLoading && (
            <div className="h-20 w-full flex items-center justify-center snap-start">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && (
            <div className="h-20 w-full flex items-center justify-center snap-start">
              <p className="text-text-sub text-xs font-black uppercase tracking-widest">
                You're all caught up ✓
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Right sidebar — desktop only */}
      <aside className="hidden xl:flex flex-col w-[360px] border-l border-border-subtle p-8 bg-surface/30 transition-colors">
        <div className="mb-8">
          <SearchBar placeholder="Search Banner ads..." />
        </div>

        {/* Balance card */}
        <div className="bg-surface rounded-[32px] p-6 border border-border-subtle relative overflow-hidden mb-8 shadow-xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <p className="text-text-sub text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Live Balance
          </p>
          <h2 className="text-3xl font-black text-text-main tracking-tighter">
            ₦145,250
          </h2>
          <button
            onClick={() => navigate("/wallet")}
            className="mt-5 w-full py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
          >
            WITHDRAW FUNDS
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-text-sub font-black text-[10px] uppercase tracking-[0.2em] mb-6 ml-2">
            Trending Brands
          </h3>
          <div className="space-y-2">
            {["CocaCola", "Samsung", "Flutterwave"].map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-between group cursor-pointer hover:bg-primary/5 p-3 rounded-2xl transition-all border border-transparent hover:border-primary/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface border border-border-subtle flex items-center justify-center font-bold text-text-main group-hover:bg-primary group-hover:text-white transition-all">
                    {brand[0]}
                  </div>
                  <span className="font-bold text-text-main/80 group-hover:text-text-main">
                    {brand}
                  </span>
                </div>
                <div className="text-[10px] font-black text-primary animate-pulse">
                  LIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Feed;
