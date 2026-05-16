import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getMe } from '@/services/api'
import type { User } from '@/types/user'

/**
 * Handles the redirect back from Auth0 after Google OAuth.
 * Extracts the access_token from the URL (query param or hash fragment),
 * stores it, fetches /users/me, then redirects to /feed.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { setTokenAndUser } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const extractToken = (): string | null => {
      // Try query params first: ?access_token=...
      const params = new URLSearchParams(window.location.search)
      const fromQuery = params.get('access_token')
      if (fromQuery) return fromQuery

      // Try hash fragment: #access_token=...
      const hash = window.location.hash.slice(1)
      const hashParams = new URLSearchParams(hash)
      return hashParams.get('access_token')
    }

    const token = extractToken()

    if (!token) {
      // No token found — go back to splash
      navigate('/', { replace: true })
      return
    }

    // Store token so axios interceptor picks it up
    localStorage.setItem('banner_access_token', token)

    getMe()
      .then((res) => {
        setTokenAndUser(token, res.data as User)
        navigate('/feed', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('banner_access_token')
        navigate('/', { replace: true })
      })
  }, [navigate, setTokenAndUser])

  return (
    <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-text-sub text-sm font-bold uppercase tracking-widest">
        Signing you in…
      </p>
    </div>
  )
}

export default AuthCallback
