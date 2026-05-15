import React from "react";
import {
  Wallet,
  TrendingUp,
  Megaphone,
  Heart,
  UserPlus,
  MessageCircle,
  AtSign,
  Play,
} from "lucide-react";
import { Notification } from "../../types/inbox";

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
  onAction?: () => void;
}

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "earnings":
      return { icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "withdrawal":
      return { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "brand_activity":
      return { icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500/10" };
    case "like":
      return { icon: Heart, color: "text-primary", bg: "bg-primary/10" };
    case "follow":
      return { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" };
    case "comment":
    case "reply":
      return { icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" };
    case "mention":
      return { icon: AtSign, color: "text-primary", bg: "bg-primary/10" };
    default:
      return { icon: MessageCircle, color: "text-text-sub", bg: "bg-surface" };
  }
};

const formatTimeAgo = (timestamp: string): string => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onAction,
}) => {
  const { icon: Icon, color, bg } = getIcon(notification.type);
  const timeAgo = formatTimeAgo(notification.timestamp);

  return (
    <div
      onClick={onPress}
      className={`flex items-start gap-3 cursor-pointer transition-opacity active:opacity-70 ${
        !notification.isRead ? "opacity-100" : "opacity-70"
      }`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary mt-5 flex-shrink-0" />
      )}
      {notification.isRead && <div className="w-2 flex-shrink-0" />}

      {/* Avatar or icon */}
      {notification.actor ? (
        <img
          src={notification.actor.avatar}
          alt={notification.actor.name}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center flex-shrink-0 border border-border-subtle`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-black text-text-main text-sm truncate">
            {notification.title}
          </h3>
          <span className="text-[10px] text-text-sub whitespace-nowrap flex-shrink-0">
            {timeAgo}
          </span>
        </div>

        <p className="text-text-sub text-sm mt-0.5 line-clamp-2">
          {notification.message}
        </p>

        {notification.actionRequired && notification.actionLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
            }}
            className="mt-2 px-4 py-1.5 bg-primary text-white text-xs font-black rounded-xl min-h-[36px]"
          >
            {notification.actionLabel}
          </button>
        )}
      </div>

      {/* Thumbnail */}
      {notification.target?.thumbnail && (
        <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden flex-shrink-0 relative border border-border-subtle">
          <img
            src={notification.target.thumbnail}
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
          {notification.target.type === "ad" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
