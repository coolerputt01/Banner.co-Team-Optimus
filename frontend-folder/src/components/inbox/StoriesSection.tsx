import React from "react";
import { Plus } from "lucide-react";
import { Story } from "../../types/inbox";

interface StoriesSectionProps {
  stories: Story[];
  currentUserStory?: Story;
  onStoryClick?: (storyId: string) => void;
  onAddStory?: () => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  currentUserStory,
  onStoryClick,
  onAddStory,
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub mb-4 ml-1">
        New Activity
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {/* Current user story */}
        {currentUserStory && (
          <div className="flex flex-col items-center flex-shrink-0">
            <button
              onClick={onAddStory}
              className="relative group"
              aria-label="Add story"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary via-coral to-yellow">
                <div className="p-0.5 bg-main-bg rounded-full">
                  <img
                    src={currentUserStory.avatar}
                    alt={currentUserStory.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-main-bg group-hover:scale-110 transition-transform">
                <Plus className="h-3 w-3 text-white" />
              </div>
            </button>
            <span className="text-[10px] mt-2 text-text-sub font-bold truncate max-w-[60px] text-center">
              Your Story
            </span>
          </div>
        )}

        {/* Friends' stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onStoryClick?.(story.id)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <div
              className={`relative p-0.5 rounded-full ${
                story.hasStory && !story.isViewed
                  ? "bg-gradient-to-tr from-primary via-coral to-yellow"
                  : "bg-border-subtle"
              }`}
            >
              <div className="p-0.5 bg-main-bg rounded-full">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              {story.isActive && (
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-main-bg rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-2 text-text-sub font-bold truncate max-w-[60px] text-center">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
