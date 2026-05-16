import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation/Navigation'
import { initiateCampaign } from '@/services/api'
import { ArrowLeft, Check } from 'lucide-react'

const DURATIONS = [
  { days: 1,  label: '1 Day',   price: 499 },
  { days: 7,  label: '7 Days',  price: 3493 },
  { days: 14, label: '14 Days', price: 6986 },
  { days: 30, label: '30 Days', price: 14970 },
]

const NewCampaign: React.FC = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(DURATIONS[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [navTab, setNavTab] = useState<'feed' | 'create' | 'profile' | 'settings'>('create')

  const handleNavChange = (t: string) => {
    const links: Record<string, string> = { feed: '/feed', create: '/create-ad', profile: '/user-profile', settings: '/settings' }
    setNavTab(t as typeof navTab)
    if (links[t]) navigate(links[t])
  }

  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await initiateCampaign(selected.days)
      const { checkout_url, payment_ref } = res.data as {
        checkout_url: string
        payment_ref: string
      }
      localStorage.setItem('banner_payment_ref', payment_ref)
      window.location.href = checkout_url
    } catch {
      setError('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={handleNavChange}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="sticky top-0 z-40 flex items-center bg-main-bg/95 backdrop-blur-md px-4 py-4 border-b border-border-subtle">
          <button
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-surface rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <h1 className="text-base font-black text-text-main italic uppercase tracking-widest flex-1 text-center pr-11">
            New Campaign
          </h1>
        </header>

        <main className="flex-1 w-full max-w-xl mx-auto p-5 lg:p-8 pb-28 lg:pb-10 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-main italic uppercase tracking-tight mb-1">
              Choose Duration
            </h2>
            <p className="text-text-sub text-sm">
              Select how long your campaign will run.
            </p>
          </div>

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
                <p className="text-text-sub text-xs mt-0.5">₦{d.price.toLocaleString()}</p>
                {selected.days === d.days && (
                  <div className="mt-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-surface rounded-2xl p-5 border border-border-subtle">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-sub text-sm font-bold">Duration</span>
              <span className="text-text-main font-black">{selected.label}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-sub text-sm font-bold">Total</span>
              <span className="text-primary font-black text-xl">₦{selected.price.toLocaleString()}</span>
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
        </main>
      </div>
    </div>
  )
}

export default NewCampaign
