import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserProfile as UserProfileType,
  EarningsData,
  BookmarkedAd,
  SharedAd,
  ProfileTab,
} from "@/types/user";
import { ProfileHeader } from "@/components/userProfile/ProfileHeader";
import { ProfileHero } from "@/components/userProfile/ProfileHero";
import { UserInfo } from "@/components/userProfile/UserInfo";
import { EarningsStats } from "@/components/userProfile/EarningsStats";
import { WalletCard } from "@/components/userProfile/WalletCard";
import { ProfileTabs } from "@/components/userProfile/ProfileTabs";
import { BookmarksGrid } from "@/components/userProfile/BookmarksGrid";
import { ActivityList } from "@/components/userProfile/ActivityList";
import { Navigation } from "@/components/navigation/Navigation";

// ─── Mock data ────────────────────────────────────────────────────────────────
const userData: UserProfileType = {
  id: "user_001",
  name: "Alex Johnson",
  username: "@alexcreates",
  bio: "Watching ads, earning rewards 💰 | Digital creator | Banner.co enthusiast",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
  coverImage:
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format",
  isVerified: true,
  joinDate: "January 2024",
};

const earningsData: EarningsData = {
  totalEarned: 12450,
  availableBalance: 9250,
  pendingBalance: 3200,
  adsWatched: 1247,
  watchTime: 2840,
  currency: "₦",
};

const bookmarksData: BookmarkedAd[] = [
  {
    id: "bm_001",
    brandName: "Nike",
    brandAvatar: "N",
    headline: "Just Do It. New Air Max collection dropping soon! 🔥",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format",
    category: "Fashion",
    earnings: 75,
    bookmarkedAt: "2024-03-15",
    views: 12400,
  },
  {
    id: "bm_002",
    brandName: "Tesla",
    brandAvatar: "T",
    headline: "Experience the future of driving. Schedule a test drive today! ⚡",
    thumbnail:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&auto=format",
    category: "Automotive",
    earnings: 100,
    bookmarkedAt: "2024-03-14",
    views: 8900,
  },
  {
    id: "bm_003",
    brandName: "Spotify",
    brandAvatar: "S",
    headline: "Your summer playlist is waiting. Get 3 months free! 🎵",
    thumbnail:
      "https://images.unsplash.com/photo-1611339555312-f607c0842fd1?w=500&auto=format",
    category: "Music",
    earnings: 40,
    bookmarkedAt: "2024-03-13",
    views: 15600,
  },
  {
    id: "bm_004",
    brandName: "Uber Eats",
    brandAvatar: "U",
    headline: "Hungry? Get 50% off your first 5 orders! 🍔",
    thumbnail:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format",
    category: "Food",
    earnings: 30,
    bookmarkedAt: "2024-03-12",
    views: 6700,
  },
];

const sharesData: SharedAd[] = [
  {
    id: "sh_001",
    brandName: "Nike",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format",
    sharedAt: "2024-03-15T10:30:00",
    platform: "twitter",
  },
  {
    id: "sh_002",
    brandName: "Spotify",
    thumbnail:
      "https://images.unsplash.com/photo-1611339555312-f607c0842fd1?w=500&auto=format",
    sharedAt: "2024-03-14T15:45:00",
    platform: "whatsapp",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("bookmarks");
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("profile");

  return (
    <div className="min-h-screen w-full bg-main-bg flex overflow-hidden font-sans transition-colors duration-300">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/upload")}
      />

      <main className="flex-1 flex flex-col lg:flex-row lg:ml-64 min-h-screen overflow-y-auto no-scrollbar">
        {/* ── Center column: hero, info, tabs ── */}
        <div className="flex-1 flex flex-col border-r border-border-subtle">
          <ProfileHeader
            title="MY PROFILE"
            onBack={() => navigate(-1)}
            onSettings={() => navigate("/settings")}
            onShare={() => console.log("Share")}
          />

          <div className="flex-1 pb-28 lg:pb-10">
            {/* Cover image */}
            <ProfileHero coverImage={userData.coverImage} />

            {/* User info */}
            <UserInfo
              user={userData}
              onEditProfile={() => navigate("/profile/edit")}
            />

            {/* Earnings stats — mobile only */}
            <div className="mt-6 xl:hidden px-4">
              <EarningsStats earnings={earningsData} />
            </div>

            {/* Wallet card — mobile only */}
            <div className="mt-6 xl:hidden px-4">
              <WalletCard
                earnings={earningsData}
                onWithdraw={() => navigate("/wallet")}
                onHistory={() => navigate("/wallet")}
              />
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="p-4 lg:p-6">
                {activeTab === "bookmarks" && (
                  <BookmarksGrid
                    bookmarks={bookmarksData}
                    onBookmarkClick={(id) => navigate(`/ad/${id}`)}
                  />
                )}
                {activeTab === "shared" && (
                  <ActivityList shares={sharesData} type="shared" />
                )}
                {activeTab === "earnings" && (
                  <div className="space-y-4">
                    <EarningsStats earnings={earningsData} />
                    <WalletCard
                      earnings={earningsData}
                      onWithdraw={() => navigate("/wallet")}
                      onHistory={() => navigate("/wallet")}
                    />
                  </div>
                )}
                {activeTab === "activity" && (
                  <ActivityList bookmarks={bookmarksData.slice(0, 3)} type="bookmarks" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right sidebar: wallet & stats (desktop only) ── */}
        <aside className="hidden xl:flex flex-col w-[360px] p-8 space-y-6 bg-surface/30 border-l border-border-subtle">
          <h3 className="text-[11px] font-black tracking-[0.25em] uppercase text-text-sub">
            Financial Overview
          </h3>
          <WalletCard
            earnings={earningsData}
            onWithdraw={() => navigate("/wallet")}
            onHistory={() => navigate("/wallet")}
          />
          <div className="bg-surface rounded-3xl p-6 border border-border-subtle shadow-xl">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-text-sub mb-6">
              Live Performance
            </h4>
            <EarningsStats earnings={earningsData} />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default UserProfile;
