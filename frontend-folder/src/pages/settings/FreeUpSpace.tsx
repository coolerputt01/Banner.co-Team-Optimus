import React, { useState } from "react";
import { SettingsSubLayout } from "@/components/settings/SettingsSubLayout";
import { Trash2, CheckCircle2, HardDrive, Image, Film, MessageSquare } from "lucide-react";

interface CacheCategory {
  id: string;
  label: string;
  size: string;
  bytes: number;
  icon: React.ReactNode;
  color: string;
}

const categories: CacheCategory[] = [
  { id: "images", label: "Cached Images", size: "124 MB", bytes: 124, icon: <Image className="h-4 w-4" />, color: "bg-primary" },
  { id: "videos", label: "Video Cache", size: "381 MB", bytes: 381, icon: <Film className="h-4 w-4" />, color: "bg-coral" },
  { id: "messages", label: "Message Media", size: "18 MB", bytes: 18, icon: <MessageSquare className="h-4 w-4" />, color: "bg-emerald-500" },
];

const FreeUpSpace: React.FC = () => {
  const [cleared, setCleared] = useState<string[]>([]);
  const [clearing, setClearing] = useState<string | null>(null);

  const totalMB = categories
    .filter((c) => !cleared.includes(c.id))
    .reduce((sum, c) => sum + c.bytes, 0);

  const clearCategory = async (id: string) => {
    setClearing(id);
    await new Promise((r) => setTimeout(r, 1200));
    setCleared((p) => [...p, id]);
    setClearing(null);
  };

  const clearAll = async () => {
    for (const cat of categories) {
      if (!cleared.includes(cat.id)) {
        await clearCategory(cat.id);
      }
    }
  };

  return (
    <SettingsSubLayout title="Free Up Space">
      {/* Usage overview */}
      <div className="bg-surface rounded-3xl border border-border-subtle p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HardDrive className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-black text-text-main tracking-tighter">
              {totalMB} MB
            </p>
            <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">
              Cache in use
            </p>
          </div>
        </div>

        {/* Bar breakdown */}
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {categories
            .filter((c) => !cleared.includes(c.id))
            .map((c) => (
              <div
                key={c.id}
                className={`${c.color} transition-all duration-500`}
                style={{ flex: c.bytes }}
              />
            ))}
          {cleared.length === categories.length && (
            <div className="flex-1 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <span className="text-[8px] font-black text-emerald-500">ALL CLEAR</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cleared.includes(c.id) ? "bg-border-subtle" : c.color}`} />
              <span className="text-[9px] font-bold text-text-sub">{c.label.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-category clear */}
      <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {categories.map((cat) => {
          const isCleared = cleared.includes(cat.id);
          const isClearing = clearing === cat.id;
          return (
            <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isCleared ? "bg-border-subtle" : `${cat.color}/10`} text-${isCleared ? "text-sub" : "primary"}`}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black uppercase tracking-tight ${isCleared ? "text-text-sub line-through" : "text-text-main"}`}>
                  {cat.label}
                </p>
                <p className="text-[10px] text-text-sub">{isCleared ? "Cleared" : cat.size}</p>
              </div>
              {isCleared ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <button
                  onClick={() => clearCategory(cat.id)}
                  disabled={isClearing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-all disabled:opacity-60"
                >
                  {isClearing ? (
                    <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  {isClearing ? "Clearing..." : "Clear"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear all */}
      {cleared.length < categories.length ? (
        <button
          onClick={clearAll}
          className="w-full h-14 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Cache
        </button>
      ) : (
        <div className="w-full h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">All Clear!</span>
        </div>
      )}
    </SettingsSubLayout>
  );
};

export default FreeUpSpace;
