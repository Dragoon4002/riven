import { eq } from 'drizzle-orm'
import { db } from '../client'
import { submissions } from '../schema'

export type NewSubmission = typeof submissions.$inferInsert
export type Submission = typeof submissions.$inferSelect

export const SubmissionQueries = {
  create: (data: NewSubmission) => db.insert(submissions).values(data).returning(),

  findByBounty: (bountyId: string) =>
    db.select().from(submissions).where(eq(submissions.bountyId, bountyId)),

  findByPR: (prUrl: string) =>
    db.select().from(submissions).where(eq(submissions.prUrl, prUrl)).then(rows => rows[0] ?? null),

  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') =>
    db.update(submissions).set({ status }).where(eq(submissions.id, id)).returning(),
}
