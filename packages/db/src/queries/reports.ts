import { eq } from 'drizzle-orm'
import { db } from '../client'
import { reports, citations } from '../schema'

export type NewReport = typeof reports.$inferInsert
export type Report = typeof reports.$inferSelect
export type NewCitation = typeof citations.$inferInsert

export const ReportQueries = {
  create: (data: NewReport) => db.insert(reports).values(data).returning(),

  findById: (id: string) =>
    db.select().from(reports).where(eq(reports.id, id)).then(rows => rows[0] ?? null),

  findByUser: (userId: string) =>
    db.select().from(reports).where(eq(reports.userId, userId)),

  addCitation: (data: NewCitation) => db.insert(citations).values(data).returning(),

  citationsForReport: (reportId: string) =>
    db.select().from(citations).where(eq(citations.reportId, reportId)),
}
