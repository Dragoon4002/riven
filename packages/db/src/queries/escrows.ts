import { eq } from 'drizzle-orm'
import { db } from '../client'
import { escrows } from '../schema'

export type NewEscrow = typeof escrows.$inferInsert
export type Escrow = typeof escrows.$inferSelect

export const EscrowQueries = {
  create: (data: NewEscrow) => db.insert(escrows).values(data).returning(),

  findById: (id: string) =>
    db.select().from(escrows).where(eq(escrows.id, id)).then(rows => rows[0] ?? null),

  updateStatus: (
    id: string,
    status: 'locked' | 'released' | 'refunded',
    extra?: { releasedAt?: Date; releasedTo?: string },
  ) => db.update(escrows).set({ status, ...extra }).where(eq(escrows.id, id)).returning(),
}
