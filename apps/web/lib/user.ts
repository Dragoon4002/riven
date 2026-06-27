'use client'

export interface StoredUser {
  userId: string
  address: string
  balance: number
}

const KEYS = {
  userId: 'riven_user_id',
  session: 'riven_session_id',
  wallet: 'riven_wallet',
} as const

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEYS.wallet)
  if (!raw) return null
  try { return JSON.parse(raw) as StoredUser } catch { return null }
}

export function setStoredUser(user: StoredUser): void {
  localStorage.setItem(KEYS.userId, user.userId)
  localStorage.setItem(KEYS.wallet, JSON.stringify(user))
}

export function clearStoredUser(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(KEYS.session)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEYS.session, id)
  }
  return id
}