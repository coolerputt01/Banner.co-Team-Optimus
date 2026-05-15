import React, { useEffect } from "react";
import { Home, Mail, User, Plus, WalletMinimal } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type NavTab = "profile" | "inbox" | "feed" | "wallet";

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onUpload?: () => void;
}

const navItems = [
  { id: "feed"    as NavTab, label: "Home",    Icon: Home,          link: "/feed" },
  { id: "wallet"  as NavTab, label: "Wallet",  Icon: WalletMinimal, link: "/wallet" },
  { id: "inbox"   as NavTab, label: "Inbox",   Icon: Mail,          link: "/inbox" },
  { id: "profile" as NavTab, label: "Profile", Icon: User,          link: "/user-profile" },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onUpload,
}) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Keep active tab in sync with the current URL
  useEffect(() => {
    const match = navItems.find((item) => item.link === location.pathname);
    if (match && match.id !== activeTab) {
      onTabChange(match.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleNav = (id: NavTab, link: string) => {
    onTabChange(id);
    navigate(link);
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-main-bg border-r border-border-subtle p-6 z-40 transition-colors">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-black text-text-main tracking-tighter italic select-none">
            BANNER<span className="text-primary">.CO</span>
          </h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ id, label, Icon, link }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id, link)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-sub hover:text-text-main hover:bg-surface"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "fill-current" : ""}`} />
                <span className="font-black italic text-sm uppercase tracking-tight">
                  {label}
                </span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Create ad CTA */}
        <div className="mt-auto pt-6 border-t border-border-subtle">
          <button
            onClick={onUpload}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 uppercase italic tracking-widest text-xs active:scale-[0.98]"
          >
            CREATE AD
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-main-bg/95 backdrop-blur-xl border-t border-border-subtle z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          {/* Left two items */}
          {navItems.slice(0, 2).map(({ id, label, Icon, link }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id, link)}
                className="flex flex-col items-center gap-0.5 flex-1 min-h-[52px] justify-center"
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-primary fill-current" : "text-text-sub"}`}
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-tighter ${
                    active ? "text-primary" : "text-text-sub"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* Centre plus button */}
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={onUpload}
              className="relative w-12 h-9 group active:scale-90 transition-transform"
              aria-label="Create ad"
            >
              <div className="absolute inset-0 bg-primary rounded-xl translate-x-1" />
              <div className="absolute inset-0 bg-coral rounded-xl -translate-x-1" />
              <div className="absolute inset-0 bg-text-primary dark:bg-white rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-main-bg dark:text-black" strokeWidth={3} />
              </div>
            </button>
          </div>

          {/* Right two items */}
          {navItems.slice(2).map(({ id, label, Icon, link }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id, link)}
                className="flex flex-col items-center gap-0.5 flex-1 min-h-[52px] justify-center"
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-primary fill-current" : "text-text-sub"}`}
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-tighter ${
                    active ? "text-primary" : "text-text-sub"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
