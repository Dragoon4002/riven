import { eq } from 'drizzle-orm'
import { db } from '../client'
import { wallets } from '../schema'

export type NewWallet = typeof wallets.$inferInsert
export type Wallet = typeof wallets.$inferSelect

export const WalletQueries = {
  create: (data: NewWallet) => db.insert(wallets).values(data).returning(),

  findByUser: (userId: string) =>
    db.select().from(wallets).where(eq(wallets.userId, userId)).then(rows => rows[0] ?? null),

  updateBalance: (id: string, balance: number) =>
    db.update(wallets).set({ balance, updatedAt: new Date() }).where(eq(wallets.id, id)).returning(),
}
