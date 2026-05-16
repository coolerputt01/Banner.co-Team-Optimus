import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { updateMe } from '@/services/api'
import {
  ArrowLeft,
  Settings,
  Verified,
  Edit2,
  Eye,
  Clock,
  X,
  Camera,
} from 'lucide-react'

type ProfileTab = 'earnings' | 'my-ads'

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
interface EditModalProps {
  onClose: () => void
  onSaved: () => void
}

const EditModal: React.FC<EditModalProps> = ({ onClose, onSaved }) => {
  const { user, refreshUser } = useAuth()
  const [businessName, setBusinessName] = useState(user?.business_name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const profileRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'banner',
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (type === 'profile') {
      setProfileFile(file)
      setProfilePreview(URL.createObjectURL(file))
    } else {
      setBannerFile(file)
    }
  }

  const handleSave = async () => {
    if (!businessName.trim()) {
      setError('Business name is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('business_name', businessName.trim())
      fd.append('bio', bio.trim())
      if (profileFile) fd.append('profile_picture', profileFile)
      if (bannerFile) fd.append('banner_picture', bannerFile)
      await updateMe(fd)
      await refreshUser()
      onSaved()
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-main-bg rounded-[2rem] w-full max-w-md shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <h3 className="font-black text-text-main italic uppercase tracking-tight text-lg">
            Edit Profile
          </h3>
          <button onClick={onClose} className="text-text-sub hover:text-text-main">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Profile picture */}
          <div className="flex flex-col items-center">
            <div
              className="relative w-24 h-24 rounded-[24px] overflow-hidden bg-surface border-2 border-border-subtle cursor-pointer group"
              onClick={() => profileRef.current?.click()}
            >
              {(profilePreview ?? user?.profile_picture) ? (
                <img
                  src={profilePreview ?? user?.profile_picture ?? ''}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20">
                  <span className="text-primary text-2xl font-black">
                    {user?.business_name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <button
              onClick={() => bannerRef.current?.click()}
              className="mt-3 text-[10px] font-black text-primary uppercase tracking-widest"
            >
              Change Banner
            </button>
            <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} />
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
          </div>

          {/* Business name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input-field"
              placeholder="Your business name"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="input-field h-auto py-3 resize-none"
              placeholder="Tell people about your business…"
            />
            <p className="text-[10px] text-text-sub text-right">{bio.length}/200</p>
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm disabled:opacity-50 hover:brightness-110 transition-all"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ProfileTab>('earnings')
  const [navTab, setNavTab] = useState<'feed' | 'create' | 'profile' | 'settings'>('profile')
  const [showEdit, setShowEdit] = useState(false)

  if (!user) return null

  return (
    <div className="min-h-screen w-full bg-main-bg flex overflow-hidden font-sans transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => {
          const links: Record<string, string> = { feed: '/feed', create: '/create-ad', profile: '/user-profile', settings: '/settings' }
          setNavTab(t as typeof navTab)
          if (links[t]) navigate(links[t])
        }}
      />

      <main className="flex-1 flex flex-col lg:ml-64 min-h-screen overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-main-bg/90 backdrop-blur-md border-b border-border-subtle">
          <button
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-sm font-black text-text-main italic uppercase tracking-widest flex-1 text-center lg:text-left lg:ml-0">
            My Profile
          </h1>
          <button
            onClick={() => navigate('/settings')}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
          >
            <Settings className="h-5 w-5 text-text-main" />
          </button>
        </div>

        {/* Banner */}
        <div className="relative w-full h-36 bg-gradient-to-br from-primary/40 to-zinc-900 overflow-hidden">
          {user.banner_picture && (
            <img
              src={user.banner_picture}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>

        {/* User info */}
        <div className="px-5 pb-6 relative">
          {/* Avatar */}
          <div className="-mt-12 mb-4 inline-block p-1 rounded-[28px] bg-main-bg shadow-xl">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.business_name}
                className="w-24 h-24 rounded-[24px] object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-[24px] bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-3xl font-black">
                  {user.business_name?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black italic tracking-tighter text-text-main uppercase">
                  {user.business_name}
                </h2>
                {user.verified && (
                  <Verified className="h-5 w-5 text-primary fill-current flex-shrink-0" />
                )}
              </div>
              <p className="text-primary font-black text-xs uppercase tracking-tight mt-0.5">
                {user.email}
              </p>
              {user.bio && (
                <p className="text-text-sub text-sm mt-3 leading-relaxed max-w-lg">
                  {user.bio}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-text-main font-black text-xs uppercase tracking-widest hover:border-primary/40 transition-all"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-5 border-t border-border-subtle">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary mb-0.5">
                <Eye className="h-4 w-4" />
                <span className="text-lg font-black text-text-main">
                  {user.number_of_ads_watched.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
                Ads Watched
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-border-subtle px-6">
              <div className="flex items-center gap-1 text-coral mb-0.5">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-black text-text-main">
                  {Math.round(user.total_ads_watch_time)}m
                </span>
              </div>
              <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
                Watch Time
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-emerald-500 mb-0.5">
                ₦{(user.wallet?.balance ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
                Balance
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {(['earnings', 'my-ads'] as ProfileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-text-sub hover:text-text-main'
              }`}
            >
              {tab === 'earnings' ? 'Earnings' : 'My Ads'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 pb-28 lg:pb-10">
          {activeTab === 'earnings' && (
            <div className="space-y-4">
              {/* Wallet card */}
              <div className="bg-primary rounded-[28px] p-6 relative overflow-hidden shadow-xl shadow-primary/20">
                <div className="absolute -bottom-4 -right-2 text-6xl font-black text-black/5 select-none italic pointer-events-none">
                  CASH
                </div>
                <p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-1">
                  Available Balance
                </p>
                <h2 className="text-4xl font-black text-black tracking-tighter italic mb-4">
                  ₦{(user.wallet?.balance ?? 0).toLocaleString()}
                </h2>
                <div className="bg-black/10 rounded-xl px-4 py-3">
                  <p className="text-black/60 text-xs font-bold text-center">
                    💳 Withdrawals coming soon
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-[20px] p-5 border border-border-subtle">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">
                    Ads Watched
                  </p>
                  <p className="text-2xl font-black text-text-main">
                    {user.number_of_ads_watched.toLocaleString()}
                  </p>
                </div>
                <div className="bg-surface rounded-[20px] p-5 border border-border-subtle">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">
                    Watch Time
                  </p>
                  <p className="text-2xl font-black text-text-main">
                    {Math.round(user.total_ads_watch_time)}
                    <span className="text-sm text-text-sub ml-1">min</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-ads' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-text-sub font-black text-xs uppercase tracking-widest mb-4">
                Your created ads appear here
              </p>
              <button
                onClick={() => navigate('/create-ad')}
                className="px-6 py-3 bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Create an Ad
              </button>
            </div>
          )}
        </div>
      </main>

      {showEdit && (
        <EditModal
          onClose={() => setShowEdit(false)}
          onSaved={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

export default UserProfile
