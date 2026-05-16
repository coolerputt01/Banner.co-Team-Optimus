import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation/Navigation'
import { initiateCampaign, createAd } from '@/services/api'
import { useAiSuggestion } from '@/hooks/useAiSuggestion'
import { ArrowLeft, Upload, X, Check, Tag, Sparkles, RefreshCw } from 'lucide-react'

// ─── Campaign duration options ────────────────────────────────────────────────
const DURATIONS = [
  { days: 1,  label: '1 Day',   price: 499 },
  { days: 7,  label: '7 Days',  price: 3493 },
  { days: 14, label: '14 Days', price: 6986 },
  { days: 30, label: '30 Days', price: 14970 },
]

// ─── Step 1 — Purchase Campaign ───────────────────────────────────────────────
interface Step1Props {
  onPaid: (paymentRef: string) => void
}

const Step1: React.FC<Step1Props> = ({ onPaid }) => {
  const [selected, setSelected] = useState(DURATIONS[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await initiateCampaign(selected.days)
      const { checkout_url, payment_ref } = res.data as {
        checkout_url: string
        payment_ref: string
      }
      // Store payment_ref so we can use it after redirect
      localStorage.setItem('banner_payment_ref', payment_ref)
      onPaid(payment_ref)
      window.location.href = checkout_url
    } catch {
      setError('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text-main italic uppercase tracking-tight mb-1">
          Choose Campaign Duration
        </h2>
        <p className="text-text-sub text-sm">
          Select how long your ad will run. Pay once, create your ad after.
        </p>
      </div>

      {/* Duration selector */}
      <div className="grid grid-cols-2 gap-3">
        {DURATIONS.map((d) => (
          <button
            key={d.days}
            onClick={() => setSelected(d)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selected.days === d.days
                ? 'border-primary bg-primary/5'
                : 'border-border-subtle bg-surface hover:border-primary/30'
            }`}
          >
            <p className={`font-black text-sm uppercase tracking-tight ${
              selected.days === d.days ? 'text-primary' : 'text-text-main'
            }`}>
              {d.label}
            </p>
            <p className="text-text-sub text-xs mt-0.5">
              ₦{d.price.toLocaleString()}
            </p>
            {selected.days === d.days && (
              <div className="mt-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-2xl p-5 border border-border-subtle">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-sub text-sm font-bold">Campaign Duration</span>
          <span className="text-text-main font-black">{selected.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-sub text-sm font-bold">Total</span>
          <span className="text-primary font-black text-xl">
            ₦{selected.price.toLocaleString()}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full h-14 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm disabled:opacity-50 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Pay & Continue →'
        )}
      </button>
    </div>
  )
}

// ─── Step 2 — Create Ad ───────────────────────────────────────────────────────
interface Step2Props {
  paymentRef: string
}

const Step2: React.FC<Step2Props> = ({ paymentRef }) => {
  const navigate = useNavigate()
  const { suggest, loading: aiLoading, error: aiError, clearError: clearAiError } = useAiSuggestion()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // AI assistant state
  const [aiInput, setAiInput] = useState('')
  const [aiApplied, setAiApplied] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, '')
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleAiSuggest = async () => {
    clearAiError()
    const result = await suggest(aiInput || title)
    if (result) {
      setTitle(result.title)
      setDescription(result.description)
      setTags(result.tags)
      setAiApplied(true)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!mediaFile) { setError('Please upload a media file'); return }
    setSubmitting(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      if (description.trim()) fd.append('description', description.trim())
      fd.append('media', mediaFile)
      tags.forEach((t) => fd.append('tags', t))
      fd.append('campaign_id', paymentRef)
      await createAd(fd)
      localStorage.removeItem('banner_payment_ref')
      navigate('/feed')
    } catch {
      setError('Failed to create ad. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-text-main italic uppercase tracking-tight mb-1">
          Create Your Ad
        </h2>
        <p className="text-text-sub text-sm">
          Payment confirmed. Now set up your ad content.
        </p>
      </div>

      {/* ── AI Assistant Panel ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            AI Ad Assistant
          </span>
          {aiApplied && (
            <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1">
              <Check className="h-3 w-3" /> Applied
            </span>
          )}
        </div>

        <p className="text-text-sub text-xs leading-relaxed">
          Describe your business or product in plain words — AI will write your title, description, and tags.
        </p>

        <div className="flex gap-2">
          <input
            value={aiInput}
            onChange={(e) => { setAiInput(e.target.value); setAiApplied(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
            placeholder='e.g. "I sell handmade leather bags in Lagos"'
            className="flex-1 bg-main-bg border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-colors placeholder:text-text-sub/50"
          />
          <button
            onClick={handleAiSuggest}
            disabled={aiLoading || (!aiInput.trim() && !title.trim())}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-black text-xs rounded-xl uppercase tracking-wider disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.97]"
          >
            {aiLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : aiApplied ? (
              <><RefreshCw className="h-3.5 w-3.5" /> Redo</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Generate</>
            )}
          </button>
        </div>

        {aiError && (
          <p className="text-red-400 text-xs font-bold">{aiError}</p>
        )}
      </div>

      {/* Media upload */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub mb-2 block">
          Media (Image or Video) *
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
            mediaPreview ? 'border-primary' : 'border-border-subtle hover:border-primary/40 bg-surface'
          }`}
        >
          {mediaPreview ? (
            mediaFile?.type.startsWith('video') ? (
              <video src={mediaPreview} className="w-full h-full object-cover" muted />
            ) : (
              <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <>
              <Upload className="h-8 w-8 text-text-sub mb-2" />
              <p className="text-text-sub text-sm font-bold">Click to upload</p>
              <p className="text-text-sub text-xs mt-1">Image or video file</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMedia} />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub">
          Ad Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Catchy headline for your ad"
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={200}
          className="input-field h-auto py-3 resize-none"
          placeholder="More details about your ad…"
        />
        <p className="text-[10px] text-text-sub text-right">{description.length}/200</p>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-sub">
          Tags (up to 5)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-sub pointer-events-none" />
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="input-field pl-9"
              placeholder="fashion, tech, food…"
              disabled={tags.length >= 5}
            />
          </div>
          <button
            type="button"
            onClick={addTag}
            disabled={tags.length >= 5 || !tagInput.trim()}
            className="px-4 h-14 bg-surface border border-border-subtle rounded-xl text-text-main font-black text-sm disabled:opacity-40 hover:border-primary/40 transition-all"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1.5 rounded-full border border-primary/20"
              >
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-14 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm disabled:opacity-50 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {submitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Submit Ad →'
        )}
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const CreateAd: React.FC = () => {
  const navigate = useNavigate()
  const [navTab, setNavTab] = useState<'feed' | 'create' | 'profile' | 'settings'>('create')

  // Check if returning from payment (payment_ref in localStorage)
  const storedRef = localStorage.getItem('banner_payment_ref')
  const [step, setStep] = useState<1 | 2>(storedRef ? 2 : 1)
  const [paymentRef, setPaymentRef] = useState(storedRef ?? '')

  const handlePaid = (ref: string) => {
    setPaymentRef(ref)
    setStep(2)
  }

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
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-base font-black text-text-main italic uppercase tracking-widest flex-1 text-center pr-11">
            Launch Your Ad
          </h1>
        </header>

        {/* Step indicator */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-primary' : step > s ? 'text-emerald-500' : 'text-text-sub'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                  step > s ? 'bg-emerald-500 border-emerald-500 text-white' :
                  step === s ? 'border-primary text-primary' :
                  'border-border-subtle text-text-sub'
                }`}>
                  {step > s ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span className="text-xs font-black uppercase tracking-wider hidden sm:block">
                  {s === 1 ? 'Purchase Campaign' : 'Create Ad'}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-emerald-500' : 'bg-border-subtle'}`} />}
            </React.Fragment>
          ))}
        </div>

        <main className="flex-1 w-full max-w-xl mx-auto p-5 lg:p-8 pb-28 lg:pb-10">
          {step === 1 ? (
            <Step1 onPaid={handlePaid} />
          ) : (
            <Step2 paymentRef={paymentRef} />
          )}
        </main>
      </div>
    </div>
  )
}

export default CreateAd
