import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InboxHeader } from "@/components/inbox/InboxHeader";
import { StoriesSection } from "@/components/inbox/StoriesSection";
import { InboxTabs } from "@/components/inbox/InboxTabs";
import { NotificationList } from "@/components/inbox/NotificationList";
import { StoryViewer } from "@/components/inbox/StoryViewer";
import { Notification, NotificationTab, Story } from "@/types/inbox";
import { Navigation } from "@/components/navigation/Navigation";

// ─── Sample data ──────────────────────────────────────────────────────────────
const currentUserStory: Story = {
  id: "current_user",
  userId: "me",
  username: "Your Story",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format",
  hasStory: true,
  isViewed: false,
};

const stories: Story[] = [
  {
    id: "story_1",
    userId: "user_1",
    username: "alex_vibe",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format",
    hasStory: true,
    isViewed: false,
    isActive: true,
  },
  {
    id: "story_2",
    userId: "user_2",
    username: "sarah_j",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format",
    hasStory: true,
    isViewed: true,
    isActive: true,
  },
  {
    id: "story_3",
    userId: "user_3",
    username: "k_dev",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format",
    hasStory: true,
    isViewed: false,
  },
  {
    id: "story_4",
    userId: "user_4",
    username: "urban_fox",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format",
    hasStory: true,
    isViewed: false,
  },
];

const notifications: Notification[] = [
  {
    id: "notif_1",
    type: "earnings",
    title: "Earnings credited",
    message: "You earned ₦50 from watching Nike Summer Vibes!",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    isRead: false,
    amount: 50,
    currency: "₦",
    target: {
      id: "ad_001",
      type: "ad",
      thumbnail:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format",
    },
  },
  {
    id: "notif_2",
    type: "withdrawal",
    title: "Withdrawal processed",
    message: "Your withdrawal of ₦5,000 has been processed successfully.",
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    isRead: false,
    amount: 5000,
    currency: "₦",
  },
  {
    id: "notif_3",
    type: "brand_activity",
    title: "Brand Activity",
    message: 'Nike posted a new ad: "Summer Collection"',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    isRead: true,
    target: {
      id: "ad_002",
      type: "ad",
      thumbnail:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format",
    },
  },
  {
    id: "notif_4",
    type: "like",
    title: "milly_rock and others",
    message: "liked your video",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    isRead: true,
    actor: {
      id: "user_like",
      name: "milly_rock",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format",
    },
  },
  {
    id: "notif_5",
    type: "follow",
    title: "jace_vfx",
    message: "started following you",
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    isRead: true,
    actionRequired: true,
    actionLabel: "Follow back",
    actor: {
      id: "user_follow",
      name: "jace_vfx",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format",
    },
  },
  {
    id: "notif_6",
    type: "comment",
    title: "creative_cat",
    message: 'commented: "This is fire! 🔥 Need to try this out."',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    isRead: true,
    actor: {
      id: "user_comment",
      name: "creative_cat",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format",
    },
    target: {
      id: "ad_003",
      type: "ad",
      thumbnail:
        "https://images.unsplash.com/photo-1611339555312-f607c0842fd1?w=200&auto=format",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [navTab, setNavTab] = useState<"profile" | "inbox" | "feed" | "wallet">("inbox");
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);

  const allStories = [currentUserStory, ...stories];

  const handleNotificationPress = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification?.target) {
      navigate(`/ad/${notification.target.id}`);
    }
  };

  const handleActionPress = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification?.type === "follow") {
      console.log("Follow back user:", notification.actor?.id);
    }
  };

  const handleNavChange = (tab: "profile" | "inbox" | "feed" | "wallet") => {
    setNavTab(tab);
    if (tab === "feed") navigate("/feed");
    else if (tab === "profile") navigate("/user-profile");
    else if (tab === "wallet") navigate("/wallet");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "replies") return n.type === "reply" || n.type === "comment";
    if (activeTab === "mentions") return n.type === "mention";
    if (activeTab === "earnings") return n.type === "earnings" || n.type === "withdrawal";
    return true;
  });

  const tabCounts = {
    all: notifications.length,
    replies: notifications.filter((n) => n.type === "reply" || n.type === "comment").length,
    mentions: notifications.filter((n) => n.type === "mention").length,
    earnings: notifications.filter((n) => n.type === "earnings" || n.type === "withdrawal").length,
  };

  return (
    <>
      <div className="min-h-screen w-full bg-main-bg flex overflow-hidden font-sans transition-colors">
        <Navigation
          activeTab={navTab}
          onTabChange={(t) => handleNavChange(t as typeof navTab)}
          onUpload={() => navigate("/create-ad")}
        />

        {/* Main content — offset by sidebar on desktop */}
        <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
          {/* Constrain content width on large screens */}
          <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto">
            <InboxHeader
              title="Inbox"
              onMenuClick={() => {}}
              onSendClick={() => {}}
            />

            <main className="flex-1 pt-20 pb-28 lg:pb-10 px-4">
              <StoriesSection
                stories={stories}
                currentUserStory={currentUserStory}
                onStoryClick={(id) => {
                  const idx = allStories.findIndex((s) => s.id === id);
                  setStoryViewerIndex(idx >= 0 ? idx : 0);
                }}
                onAddStory={() => setStoryViewerIndex(0)}
              />

              <InboxTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={tabCounts}
              />

              <NotificationList
                notifications={filteredNotifications}
                onNotificationPress={handleNotificationPress}
                onActionPress={handleActionPress}
              />
            </main>
          </div>
        </div>
      </div>

      {storyViewerIndex !== null && (
        <StoryViewer
          stories={allStories}
          initialIndex={storyViewerIndex}
          onClose={() => setStoryViewerIndex(null)}
        />
      )}
    </>
  );
};

export default Inbox;

