import { eq } from 'drizzle-orm'
import { db } from '../client'
import { users } from '../schema'

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect

export const UserQueries = {
  create: (data: NewUser) => db.insert(users).values(data).returning(),

  findById: (id: string) =>
    db.select().from(users).where(eq(users.id, id)).then(rows => rows[0] ?? null),

  findByEmail: (email: string) =>
    db.select().from(users).where(eq(users.email, email)).then(rows => rows[0] ?? null),

  updateGithub: (id: string, githubId: string) =>
    db.update(users).set({ githubId }).where(eq(users.id, id)).returning(),
}
