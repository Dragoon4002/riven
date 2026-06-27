import { eq } from 'drizzle-orm'
import { db } from '../client'
import { sources } from '../schema'

export type NewSource = typeof sources.$inferInsert
export type Source = typeof sources.$inferSelect

export const SourceQueries = {
  create: (data: NewSource) => db.insert(sources).values(data).returning(),

  findById: (id: string) =>
    db.select().from(sources).where(eq(sources.id, id)).then(rows => rows[0] ?? null),

  findByAuthor: (authorId: string) =>
    db.select().from(sources).where(eq(sources.authorId, authorId)),

  list: () => db.select().from(sources),

  updateTrustScore: (id: string, trustScore: number) =>
    db.update(sources).set({ trustScore }).where(eq(sources.id, id)).returning(),
}
