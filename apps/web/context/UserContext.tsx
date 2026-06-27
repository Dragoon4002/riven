'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredUser } from '../lib/user'

interface UserState {
  userId: string | null
  address: string | null
  balance: number
  githubConnected: boolean
  loading: boolean
  refresh: () => void
}

const defaultState: Omit<UserState, 'refresh'> = {
  userId: null, address: null, balance: 0, githubConnected: false, loading: true,
}

const UserContext = createContext<UserState>({ ...defaultState, loading: true, refresh: () => {} })

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<UserState, 'refresh'>>(() => {
    if (typeof window === 'undefined') return defaultState
    const stored = getStoredUser()
    if (stored) {
      return { userId: stored.userId, address: stored.address, balance: stored.balance, githubConnected: false, loading: true }
    }
    return defaultState
  })

  async function load() {
    try {
      const res = await fetch('/api/user/me')
      if (!res.ok) { setState(s => ({ ...s, loading: false })); return }
      const data = await res.json() as { loggedIn: boolean; userId?: string; address?: string; balance?: number; githubConnected?: boolean }
      if (data.loggedIn && data.userId) {
        setState({ userId: data.userId, address: data.address ?? null, balance: data.balance ?? 0, githubConnected: !!data.githubConnected, loading: false })
      } else {
        setState({ ...defaultState, loading: false })
      }
    } catch {
      setState(s => ({ ...s, loading: false }))
    }
  }

  useEffect(() => { load() }, [])

  return (
    <UserContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)