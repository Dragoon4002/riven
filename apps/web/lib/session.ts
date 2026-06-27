import { cookies } from 'next/headers'

export async function getUserIdFromCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get('riven_user')?.value ?? null
}