export type NotificationType =
  | "earnings"
  | "withdrawal"
  | "brand_activity"
  | "like"
  | "follow"
  | "comment"
  | "reply"
  | "mention";

export type NotificationTab = "all" | "replies" | "mentions" | "earnings";

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
  isActive?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actor?: {
    id: string;
    name: string;
    avatar: string;
  };
  target?: {
    id: string;
    type: "ad" | "comment" | "profile";
    thumbnail?: string;
    title?: string;
  };
  amount?: number;
  currency?: string;
  actionRequired?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}
