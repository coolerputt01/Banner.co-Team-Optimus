import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@/types/user'
import { getMe } from '@/services/api'
import { initiateLogout } from '@/services/api'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokenAndUser: (token: string, user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe()
      setUser(res.data as User)
    } catch {
      // Token invalid — clear everything
      localStorage.removeItem('banner_access_token')
      setToken(null)
      setUser(null)
    }
  }, [])

  // On mount: read token from localStorage and validate it
  useEffect(() => {
    const stored = localStorage.getItem('banner_access_token')
    if (stored) {
      setToken(stored)
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  const setTokenAndUser = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('banner_access_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    initiateLogout()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        setTokenAndUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
