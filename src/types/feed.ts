export interface Brand {
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
}

export interface AdStats {
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
}

export interface AdContent {
  headline: string;
  category: string;
  isAd: boolean;
  thumbnail: string;
  videoUrl?: string; // Add this for real video
}

export interface Ad {
  id: string;
  brand: Brand;
  content: AdContent;
  earnings: number;
  stats: AdStats;
}

export interface FeedResponse {
  ads: Ad[];
  nextPage?: number;
  hasMore: boolean;
}
