import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation/Navigation'
import { SettingsAppearance } from '@/components/settings/SettingsAppearance'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Verified, LogOut, PlusCircle } from 'lucide-react'

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [navTab, setNavTab] = useState<'feed' | 'create' | 'profile' | 'settings'>('settings')

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => {
          const links: Record<string, string> = { feed: '/feed', create: '/create-ad', profile: '/user-profile', settings: '/settings' }
          setNavTab(t as typeof navTab)
          if (links[t]) navigate(links[t])
        }}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center bg-main-bg/95 backdrop-blur-md px-4 py-4 border-b border-border-subtle">
          <button
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-text-main text-base font-black italic uppercase tracking-widest flex-1 text-center pr-11">
            Settings
          </h1>
        </header>

        <main className="flex-1 w-full max-w-2xl mx-auto p-4 lg:p-8 pb-28 lg:pb-10 space-y-6">

          {/* Account info (read-only) */}
          {user && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-sub px-1 mb-3">
                Account
              </h3>
              <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.business_name}
                      className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-black text-lg">
                        {user.business_name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-black text-text-main text-sm uppercase tracking-tight truncate">
                        {user.business_name}
                      </p>
                      {user.verified && (
                        <Verified className="h-4 w-4 text-primary fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-text-sub text-xs truncate">{user.email}</p>
                  </div>
                </div>
                <div className="border-t border-border-subtle px-5 py-3 flex items-center justify-between">
                  <span className="text-text-sub text-xs font-bold uppercase tracking-wider">
                    Wallet Balance
                  </span>
                  <span className="text-emerald-500 font-black text-sm">
                    ₦{(user.wallet?.balance ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-border-subtle px-5 py-3 flex items-center justify-between">
                  <span className="text-text-sub text-xs font-bold uppercase tracking-wider">
                    Verified Status
                  </span>
                  <span className={`font-black text-xs uppercase ${user.verified ? 'text-primary' : 'text-text-sub'}`}>
                    {user.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Create Ad shortcut */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-sub px-1 mb-3">
              Advertising
            </h3>
            <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
              <button
                onClick={() => navigate('/create-ad')}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                  <PlusCircle className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-text-main font-black text-sm uppercase tracking-tight italic">
                    Create an Ad
                  </p>
                  <p className="text-text-sub text-xs">Launch a new campaign</p>
                </div>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <SettingsAppearance />

          {/* Logout */}
          <div className="mt-4">
            <button
              onClick={logout}
              className="w-full h-14 bg-surface rounded-2xl text-red-500 font-black text-sm uppercase tracking-widest border border-border-subtle hover:bg-red-500/5 hover:border-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
            <p className="text-center text-text-sub text-[10px] mt-4 tracking-widest uppercase opacity-40">
              Banner.co — v1.0.0
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings
