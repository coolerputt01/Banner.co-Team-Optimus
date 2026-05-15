export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  isVerified: boolean;
  joinDate: string;
}

export interface EarningsData {
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  adsWatched: number;
  watchTime: number; // in minutes
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "withdrawal";
  amount: number;
  date: string;
  description: string;
  status: "completed" | "pending" | "failed";
}

export interface BookmarkedAd {
  id: string;
  brandName: string;
  brandAvatar: string;
  headline: string;
  thumbnail: string;
  category: string;
  earnings: number;
  bookmarkedAt: string;
  views: number;
}

export interface SharedAd {
  id: string;
  brandName: string;
  thumbnail: string;
  sharedAt: string;
  platform: "twitter" | "whatsapp" | "instagram" | "copy";
}

export type ProfileTab = "bookmarks" | "shared" | "earnings" | "activity";
