import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation/Navigation'
import { getFeed, likeAd, unlikeAd, isLiked, getLikeCount, recordView, getComments, addComment } from '@/services/api'
import type { Ad } from '@/types/feed'
import type { Comment } from '@/types/comment'
import { Heart, MessageCircle, Share2, X, Send, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { initiateLogin } from '@/services/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isVideo = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

// ─── Sign-in prompt modal ─────────────────────────────────────────────────────
interface SignInPromptProps {
  onClose: () => void
}

const SignInPrompt: React.FC<SignInPromptProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <div
      className="relative w-full max-w-sm mx-auto bg-zinc-900 rounded-t-[2rem] sm:rounded-[2rem] p-8 border border-white/10 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
        <X className="h-5 w-5" />
      </button>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
          <LogIn className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h3 className="text-white font-black text-xl tracking-tight">Sign in to interact</h3>
          <p className="text-white/50 text-sm mt-1">
            Create an account to like, comment, and earn rewards from ads.
          </p>
        </div>
        <button
          onClick={initiateLogin}
          className="w-full flex items-center justify-center gap-3 h-13 bg-white rounded-2xl font-bold text-zinc-900 hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg mt-2 py-3.5"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" />
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.29 21.3 7.31 24 12 24z" fill="#34A853" />
            <path d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.934 11.934 0 000 10.76l3.98-3.09z" fill="#FBBC05" />
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  </div>
)

// ─── Ad Card ─────────────────────────────────────────────────────────────────
interface AdCardProps {
  ad: Ad
  isActive: boolean
  isAuthenticated: boolean
  onCommentOpen: (adId: string) => void
  onAuthRequired: () => void
}

const AdCard: React.FC<AdCardProps> = ({ ad, isActive, isAuthenticated, onCommentOpen, onAuthRequired }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(ad.likes ?? 0)
  const [likeLoading, setLikeLoading] = useState(false)
  const viewRecorded = useRef(false)

  // Load like state when card becomes active (only for authenticated users)
  useEffect(() => {
    if (!isActive || !isAuthenticated) return
    isLiked(ad.id)
      .then((r) => setLiked(r.data?.liked ?? false))
      .catch(() => {})
    getLikeCount(ad.id)
      .then((r) => setLikeCount(r.data?.count ?? ad.likes ?? 0))
      .catch(() => {})
  }, [isActive, isAuthenticated, ad.id, ad.likes])

  // Record view once per session when card becomes active (auth required)
  useEffect(() => {
    if (isActive && !viewRecorded.current && isAuthenticated) {
      viewRecorded.current = true
      recordView(ad.id).catch(() => {})
    }
  }, [isActive, isAuthenticated, ad.id])

  const toggleLike = async () => {
    if (!isAuthenticated) { onAuthRequired(); return }
    if (likeLoading) return
    setLikeLoading(true)
    try {
      if (liked) {
        await unlikeAd(ad.id)
        setLiked(false)
        setLikeCount((c) => Math.max(0, c - 1))
      } else {
        await likeAd(ad.id)
        setLiked(true)
        setLikeCount((c) => c + 1)
      }
    } catch {
      // revert optimistic update on error
    } finally {
      setLikeLoading(false)
    }
  }

  const handleComment = () => {
    if (!isAuthenticated) { onAuthRequired(); return }
    onCommentOpen(ad.id)
  }

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden">
      {/* Media */}
      {ad.media_url ? (
        isVideo(ad.media_url) ? (
          <video
            src={ad.media_url}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={ad.media_url}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        )
      ) : (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
          <span className="text-white/20 text-xs font-black uppercase tracking-widest">No media</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 pr-20">
        <h2 className="text-white font-black text-lg leading-tight mb-2 line-clamp-2">
          {ad.title}
        </h2>
        {ad.description && (
          <p className="text-white/70 text-sm line-clamp-2 mb-3">{ad.description}</p>
        )}
        {ad.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ad.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded-full border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action rail */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
        {/* Like */}
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1"
          aria-label="Like"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-red-500' : 'bg-white/10'}`}>
            <Heart className={`h-5 w-5 ${liked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-white text-[10px] font-bold">{formatCount(likeCount)}</span>
        </button>

        {/* Comment */}
        <button
          onClick={handleComment}
          className="flex flex-col items-center gap-1"
          aria-label="Comments"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold">
            {formatCount(ad.comments ?? 0)}
          </span>
        </button>

        {/* Share (client-side only, no auth needed) */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: ad.title, url: window.location.href }).catch(() => {})
            }
          }}
          className="flex flex-col items-center gap-1"
          aria-label="Share"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold uppercase">Share</span>
        </button>
      </div>
    </div>
  )
}

// ─── Comment Sheet ────────────────────────────────────────────────────────────
interface CommentSheetProps {
  adId: string
  onClose: () => void
}

const CommentSheet: React.FC<CommentSheetProps> = ({ adId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getComments(adId)
      .then((r) => setComments(r.data as Comment[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [adId])

  const handlePost = async () => {
    if (!text.trim() || posting) return
    setPosting(true)
    try {
      const res = await addComment(adId, text.trim())
      setComments((prev) => [res.data as Comment, ...prev])
      setText('')
    } catch {
      // silently fail
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-auto bg-main-bg rounded-t-[2rem] border-t border-border-subtle max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h3 className="font-black text-text-main uppercase tracking-tight">Comments</h3>
          <button onClick={onClose} className="text-text-sub hover:text-text-main">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-text-sub text-sm text-center py-8">No comments yet. Be first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-black">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-text-main text-sm">{c.content}</p>
                  <p className="text-text-sub text-[10px] mt-0.5">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border-subtle flex gap-3 items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            placeholder="Add a comment…"
            className="flex-1 bg-surface rounded-xl px-4 py-2.5 text-sm text-text-main outline-none border border-border-subtle focus:border-primary"
          />
          <button
            onClick={handlePost}
            disabled={!text.trim() || posting}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="w-full h-full bg-zinc-900 animate-pulse flex items-end p-6">
    <div className="w-full space-y-3">
      <div className="h-5 bg-white/10 rounded-lg w-3/4" />
      <div className="h-4 bg-white/10 rounded-lg w-1/2" />
    </div>
  </div>
)

// ─── Feed Page ────────────────────────────────────────────────────────────────
const navLinks: Record<string, string> = {
  feed: '/feed',
  create: '/create-ad',
  profile: '/user-profile',
  settings: '/settings',
}

const Feed: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [commentAdId, setCommentAdId] = useState<string | null>(null)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [navTab, setNavTab] = useState<'feed' | 'create' | 'profile' | 'settings'>('feed')
  const scrollRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const loadFeed = useCallback(async (append = false) => {
    if (loadingRef.current) return
    loadingRef.current = true
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const res = await getFeed(10)
      const data = res.data as { ads: Ad[]; total: number }
      if (append) {
        setAds((prev) => [...prev, ...data.ads])
      } else {
        setAds(data.ads)
      }
      // Simple heuristic: if fewer than 10 returned, no more pages
      if (data.ads.length < 10) setHasMore(false)
    } catch {
      // keep existing ads on error
    } finally {
      setLoading(false)
      setLoadingMore(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, clientHeight, scrollHeight } = el
    const newIndex = Math.round(scrollTop / clientHeight)
    if (newIndex !== currentIndex) setCurrentIndex(newIndex)
    if (scrollHeight - scrollTop - clientHeight < 300 && hasMore && !loadingRef.current) {
      loadFeed(true)
    }
  }, [currentIndex, hasMore, loadFeed])

  // Gate protected nav tabs for guests
  const handleNavChange = (tab: string) => {
    if (!isAuthenticated && tab !== 'feed') {
      setShowSignInPrompt(true)
      return
    }
    setNavTab(tab as typeof navTab)
    const link = navLinks[tab]
    if (link) navigate(link)
  }

  return (
    <div className="h-screen w-full bg-black flex overflow-hidden font-sans">
      <Navigation
        activeTab={navTab}
        onTabChange={handleNavChange}
      />

      <main className="flex-1 flex flex-col relative h-full lg:ml-64">
        {/* Guest banner */}
        {!isAuthenticated && (
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/90 backdrop-blur-sm">
            <p className="text-white text-xs font-bold">
              Sign in to like, comment & earn rewards
            </p>
            <button
              onClick={() => setShowSignInPrompt(true)}
              className="flex-shrink-0 px-3 py-1.5 bg-white text-primary text-xs font-black rounded-xl"
            >
              Sign in
            </button>
          </div>
        )}

        {loading ? (
          <div className="w-full h-full">
            <SkeletonCard />
          </div>
        ) : ads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <p className="text-white/60 font-black text-lg uppercase tracking-widest">
              No ads yet
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create-ad')}
                className="px-6 py-3 bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-widest"
              >
                Create the first ad
              </button>
            )}
          </div>
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            style={{ paddingTop: !isAuthenticated ? '40px' : undefined }}
          >
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className="h-[calc(100dvh-64px)] lg:h-screen w-full snap-start"
              >
                <AdCard
                  ad={ad}
                  isActive={index === currentIndex}
                  isAuthenticated={isAuthenticated}
                  onCommentOpen={setCommentAdId}
                  onAuthRequired={() => setShowSignInPrompt(true)}
                />
              </div>
            ))}

            {loadingMore && (
              <div className="h-20 w-full flex items-center justify-center snap-start">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!hasMore && ads.length > 0 && (
              <div className="h-20 w-full flex items-center justify-center snap-start">
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">
                  You're all caught up ✓
                </p>
              </div>
            )}
          </div>
        )}

        {/* Desktop right sidebar — only for authenticated users */}
        {isAuthenticated && (
          <aside className="hidden xl:flex flex-col w-[320px] border-l border-white/5 p-6 bg-zinc-950/80 absolute right-0 top-0 h-full">
            <div className="mb-6">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                Signed in as
              </p>
              <p className="text-white font-black text-sm truncate">
                {user?.business_name ?? user?.email ?? '—'}
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                Wallet Balance
              </p>
              <p className="text-3xl font-black text-white tracking-tighter">
                ₦{(user?.wallet?.balance ?? 0).toLocaleString()}
              </p>
              <p className="text-white/30 text-xs mt-2">Withdrawals coming soon</p>
            </div>
          </aside>
        )}
      </main>

      {commentAdId && (
        <CommentSheet adId={commentAdId} onClose={() => setCommentAdId(null)} />
      )}

      {showSignInPrompt && (
        <SignInPrompt onClose={() => setShowSignInPrompt(false)} />
      )}
    </div>
  )
}

export default Feed
