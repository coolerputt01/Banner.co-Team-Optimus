import React from 'react'
import { MousePointerClick } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { initiateLogin } from '@/services/api'

const Splash: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const isDark = resolvedTheme === 'dark'

  const overlayClass = isDark ? 'bg-black/60' : 'bg-white/40'

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80")',
          }}
        />
        <div className={`absolute inset-0 z-10 backdrop-blur-[2px] ${overlayClass}`} />
      </div>

      {/* Content */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Brand */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30">
            <MousePointerClick className="h-10 w-10" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white">
            Banner<span className="text-primary">.co</span>
          </h1>
          <p className="mt-4 text-xl font-medium text-white/80 text-center max-w-xs">
            Watch Ads. Get Paid.
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 ring-1 ring-white/20 shadow-2xl">
          <h2 className="text-2xl font-black text-white text-center mb-2 tracking-tight">
            Get Started
          </h2>
          <p className="text-white/60 text-sm text-center mb-8">
            Sign in to start earning from ads
          </p>

          {/* Google sign-in */}
          <button
            onClick={initiateLogin}
            className="w-full flex items-center justify-center gap-3 h-14 bg-white rounded-2xl font-bold text-zinc-900 hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
          >
            {/* Google logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" />
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.29 21.3 7.31 24 12 24z" fill="#34A853" />
              <path d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.934 11.934 0 000 10.76l3.98-3.09z" fill="#FBBC05" />
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Guest browse */}
          <button
            onClick={() => navigate('/feed')}
            className="w-full mt-3 h-12 rounded-2xl border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            Browse as guest
          </button>

          <p className="mt-6 text-center text-[11px] text-white/40">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-white/70 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      {/* Bottom home indicator */}
      <div className="relative z-30 flex h-8 items-center justify-center lg:hidden">
        <div className="h-1.5 w-32 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

export default Splash
