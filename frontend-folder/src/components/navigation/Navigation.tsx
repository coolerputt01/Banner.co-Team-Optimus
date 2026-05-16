import React, { useEffect } from 'react'
import { Home, PlusCircle, User, Settings } from 'lucide-react'
import { useLocation } from 'react-router-dom'

type NavTab = 'feed' | 'create' | 'profile' | 'settings'

interface NavigationProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

const navItems: { id: NavTab; label: string; Icon: React.FC<{ className?: string }>; link: string }[] = [
  { id: 'feed',     label: 'Feed',     Icon: Home,        link: '/feed' },
  { id: 'create',   label: 'Create',   Icon: PlusCircle,  link: '/create-ad' },
  { id: 'profile',  label: 'Profile',  Icon: User,        link: '/user-profile' },
  { id: 'settings', label: 'Settings', Icon: Settings,    link: '/settings' },
]

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const location = useLocation()

  // Sync active tab with URL
  useEffect(() => {
    const match = navItems.find((item) => item.link === location.pathname)
    if (match && match.id !== activeTab) {
      onTabChange(match.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleNav = (id: NavTab) => {
    onTabChange(id)
  }

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
          {navItems.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-sub hover:text-text-main hover:bg-surface'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'fill-current' : ''}`} />
                <span className="font-black italic text-sm uppercase tracking-tight">
                  {label}
                </span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            )
          })}
        </nav>

        {/* Create ad CTA */}
        <div className="mt-auto pt-6 border-t border-border-subtle">
          <button
            onClick={() => handleNav('create')}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 uppercase italic tracking-widest text-xs active:scale-[0.98]"
          >
            + CREATE AD
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-main-bg/95 backdrop-blur-xl border-t border-border-subtle z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        <div className="flex items-center justify-around px-2 pt-1 pb-2">
          {navItems.map(({ id, label, Icon }) => {
            const active = activeTab === id
            const isCreate = id === 'create'
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex flex-col items-center gap-0.5 flex-1 min-h-[52px] justify-center ${
                  isCreate ? 'relative' : ''
                }`}
              >
                {isCreate ? (
                  // Highlighted create button
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-0.5">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <Icon
                    className={`h-5 w-5 ${active ? 'text-primary fill-current' : 'text-text-sub'}`}
                  />
                )}
                <span
                  className={`text-[9px] font-black uppercase tracking-tighter ${
                    active || isCreate ? 'text-primary' : 'text-text-sub'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
