import { NextResponse } from 'next/server'
import { getUserIdFromCookie } from '../../../../lib/session'
import { UserQueries, WalletQueries } from '@riven/db'

export async function GET() {
  const userId = await getUserIdFromCookie()
  if (!userId) return NextResponse.json({ loggedIn: false })

  const [user, wallet] = await Promise.all([
    UserQueries.findById(userId),
    WalletQueries.findByUser(userId),
  ])

  if (!user || !wallet) return NextResponse.json({ loggedIn: false })

  return NextResponse.json({
    loggedIn: true,
    userId: user.id,
    address: wallet.address,
    balance: wallet.balance,
    githubConnected: !!user.githubId,
    githubUsername: user.githubId ?? null,
  })
}