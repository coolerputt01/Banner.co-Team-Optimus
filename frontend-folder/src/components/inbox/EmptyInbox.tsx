import React from "react";
import { Inbox } from "lucide-react";

interface EmptyInboxProps {
  title?: string;
  message?: string;
}

export const EmptyInbox: React.FC<EmptyInboxProps> = ({
  title = "No notifications yet",
  message = "When you receive notifications, they'll appear here",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4 border border-border-subtle">
        <Inbox className="h-10 w-10 text-text-sub" />
      </div>
      <p className="text-text-main font-black text-sm uppercase tracking-widest text-center">
        {title}
      </p>
      <p className="text-text-sub text-center text-xs mt-2 max-w-xs">
        {message}
      </p>
    </div>
  );
};
