import { and, eq } from 'drizzle-orm'
import { db } from '../client'
import { bounties } from '../schema'

export type NewBounty = typeof bounties.$inferInsert
export type Bounty = typeof bounties.$inferSelect

export const BountyQueries = {
  create: (data: NewBounty) => db.insert(bounties).values(data).returning(),

  findById: (id: string) =>
    db.select().from(bounties).where(eq(bounties.id, id)).then(rows => rows[0] ?? null),

  list: (status?: 'active' | 'completed' | 'cancelled') =>
    status
      ? db.select().from(bounties).where(eq(bounties.status, status))
      : db.select().from(bounties),

  findByGithubIssue: (githubIssueId: string, repoUrl: string) =>
    db.select().from(bounties)
      .where(and(eq(bounties.githubIssueId, githubIssueId), eq(bounties.repoUrl, repoUrl)))
      .then(rows => rows[0] ?? null),

  findByGithubRepo: (repoUrl: string) =>
    db.select().from(bounties)
      .where(and(eq(bounties.repoUrl, repoUrl), eq(bounties.status, 'active'))),

  updateStatus: (id: string, status: 'active' | 'completed' | 'cancelled') =>
    db.update(bounties).set({ status }).where(eq(bounties.id, id)).returning(),
}
