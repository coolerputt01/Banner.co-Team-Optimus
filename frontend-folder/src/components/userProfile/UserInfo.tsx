import React from "react";
import { Verified, Calendar, Edit2 } from "lucide-react";
import { UserProfile } from "../../types/user";

export const UserInfo: React.FC<{
  user: UserProfile;
  onEditProfile: () => void;
}> = ({ user, onEditProfile }) => (
  <div className="px-4 sm:px-6 relative">
    {/* Avatar row */}
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-14">
      <div className="p-1 rounded-[28px] bg-main-bg inline-block shadow-2xl overflow-hidden border-2 border-main-bg self-start">
        <img
          src={user.avatar}
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] object-cover"
          alt={user.name}
        />
      </div>

      {/* Name + edit button row */}
      <div className="flex-1 flex flex-row items-start sm:items-end justify-between gap-3 pb-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-3xl font-black italic tracking-tighter text-text-main uppercase leading-tight">
              {user.name}
            </h2>
            {user.isVerified && (
              <Verified className="h-5 w-5 text-primary fill-current flex-shrink-0" />
            )}
          </div>
          <p className="text-primary font-black text-xs tracking-tight uppercase mt-0.5">
            {user.username}
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="flex-shrink-0 px-4 py-2.5 bg-text-primary dark:bg-white text-main-bg dark:text-black font-black text-[10px] rounded-xl uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-1.5 min-h-[40px]"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">EDIT PROFILE</span>
          <span className="sm:hidden">EDIT</span>
        </button>
      </div>
    </div>

    {/* Bio */}
    <p className="mt-4 text-text-sub font-medium leading-relaxed max-w-xl text-sm">
      {user.bio}
    </p>

    {/* Join date */}
    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase text-text-sub tracking-widest">
      <Calendar className="h-3 w-3" />
      JOINED {user.joinDate}
    </div>
  </div>
);
