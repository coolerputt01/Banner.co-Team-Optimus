import React, { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, Play, User } from "lucide-react";

interface SearchResult {
  id: string;
  type: "brand" | "ad" | "user";
  title: string;
  subtitle: string;
  avatar?: string;
}

const mockResults: SearchResult[] = [
  { id: "r1", type: "brand", title: "Nike", subtitle: "Verified Brand · 1.2M followers", avatar: "N" },
  { id: "r2", type: "brand", title: "Samsung", subtitle: "Verified Brand · 890K followers", avatar: "S" },
  { id: "r3", type: "ad", title: "Summer Vibes Collection", subtitle: "Nike · Fashion · ₦75 earnings", avatar: "N" },
  { id: "r4", type: "ad", title: "Galaxy S25 Ultra", subtitle: "Samsung · Tech · ₦120 earnings", avatar: "S" },
  { id: "r5", type: "user", title: "alex_vibe", subtitle: "1.2K followers · 450 ads watched", avatar: "A" },
  { id: "r6", type: "brand", title: "Flutterwave", subtitle: "Verified Brand · 340K followers", avatar: "F" },
  { id: "r7", type: "ad", title: "Pay with Ease", subtitle: "Flutterwave · Finance · ₦90 earnings", avatar: "F" },
];

const trending = ["Nike Summer", "Samsung Galaxy", "Flutterwave Pay", "Coca-Cola", "Tesla EV"];

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search brands, ads...",
  className = "",
  onResultClick,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isFocused;
  const showResults = query.trim().length > 0 && results.length > 0;
  const showTrending = query.trim().length === 0;
  const showEmpty = query.trim().length > 0 && results.length === 0;

  const typeIcon = (type: SearchResult["type"]) => {
    if (type === "brand") return <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><TrendingUp className="h-3 w-3 text-primary" /></div>;
    if (type === "ad") return <div className="w-5 h-5 rounded bg-coral/10 flex items-center justify-center"><Play className="h-3 w-3 text-coral" /></div>;
    return <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center"><User className="h-3 w-3 text-emerald-500" /></div>;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`flex items-center gap-3 h-12 bg-surface rounded-2xl px-4 border transition-all ${
          isFocused ? "border-primary ring-1 ring-primary/20" : "border-border-subtle"
        }`}
      >
        <Search className={`h-4 w-4 flex-shrink-0 transition-colors ${isFocused ? "text-primary" : "text-text-sub"}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text-main placeholder:text-text-sub outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <X className="h-4 w-4 text-text-sub hover:text-text-main transition-colors" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-main-bg border border-border-subtle rounded-2xl shadow-2xl z-50 overflow-hidden">
          {showTrending && (
            <div className="p-4">
              <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="px-3 py-1.5 bg-surface border border-border-subtle rounded-full text-xs font-black text-text-sub hover:border-primary/30 hover:text-primary transition-all uppercase tracking-wider"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="divide-y divide-border-subtle">
              {results.map((r) => (
                <button
                  key={r.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left"
                  onClick={() => {
                    setQuery(r.title);
                    setIsFocused(false);
                    onResultClick?.(r);
                  }}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                    {r.avatar}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-text-main uppercase tracking-tight truncate">
                      {r.title}
                    </p>
                    <p className="text-[10px] text-text-sub truncate">{r.subtitle}</p>
                  </div>
                  {/* Type chip */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {typeIcon(r.type)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showEmpty && (
            <div className="px-4 py-8 flex flex-col items-center text-center">
              <Search className="h-8 w-8 text-text-sub/30 mb-2" />
              <p className="text-sm font-black text-text-sub uppercase tracking-widest">
                No results for "{query}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
