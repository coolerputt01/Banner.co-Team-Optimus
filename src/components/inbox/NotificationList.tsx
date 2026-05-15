import React from "react";
import { Notification } from "../../types/inbox";
import { NotificationItem } from "./NotificationItem";
import { EmptyInbox } from "./EmptyInbox";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress?: (id: string) => void;
  onActionPress?: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationPress,
  onActionPress,
}) => {
  if (notifications.length === 0) {
    return <EmptyInbox />;
  }

  return (
    <div className="space-y-6">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onPress={() => onNotificationPress?.(notification.id)}
          onAction={() => onActionPress?.(notification.id)}
        />
      ))}
    </div>
  );
};
