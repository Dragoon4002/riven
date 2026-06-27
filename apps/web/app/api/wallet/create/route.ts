import { NextResponse } from 'next/server'
import { WalletClient } from '@riven/arc-client'
import { UserQueries, WalletQueries } from '@riven/db'

export async function POST() {
  const wallet = await WalletClient.create()
  const userId = crypto.randomUUID()

  await UserQueries.create({
    id: userId,
    walletId: wallet.walletId,
    role: 'user',
  })

  await WalletQueries.create({
    id: wallet.walletId,
    arcWalletId: wallet.walletId,
    address: wallet.address,
    userId,
    balance: 0,
  })

  const res = NextResponse.json({ userId, address: wallet.address, balance: 0 })
  res.cookies.set('riven_user', userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return res
}