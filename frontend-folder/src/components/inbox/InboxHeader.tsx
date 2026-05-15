import React from "react";
import { Menu, Send } from "lucide-react";

interface InboxHeaderProps {
  title: string;
  onMenuClick?: () => void;
  onSendClick?: () => void;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  title,
  onMenuClick,
  onSendClick,
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-main-bg/90 backdrop-blur-xl border-b border-border-subtle flex justify-between items-center px-4 h-16">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-surface rounded-full transition-colors"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5 text-text-main" />
      </button>

      <h1 className="font-black text-xl tracking-tight text-text-main italic uppercase">
        {title}
      </h1>

      <button
        onClick={onSendClick}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-surface rounded-full transition-colors"
        aria-label="Send"
      >
        <Send className="h-5 w-5 text-text-main" />
      </button>
    </nav>
  );
};
