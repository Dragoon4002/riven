import { eq, inArray } from 'drizzle-orm'
import { db } from '../client'
import { paymentOrders, batchReceipts } from '../schema'

export type NewPaymentOrder = typeof paymentOrders.$inferInsert
export type PaymentOrderRow = typeof paymentOrders.$inferSelect
export type NewBatchReceipt = typeof batchReceipts.$inferInsert

export const PaymentQueries = {
  createOrder: (data: NewPaymentOrder) =>
    db.insert(paymentOrders).values(data).returning(),

  updateOrder: (id: string, update: Partial<Pick<PaymentOrderRow, 'status' | 'batchId' | 'txHash'>>) =>
    db.update(paymentOrders).set(update).where(eq(paymentOrders.id, id)).returning(),

  updateOrdersBatch: (ids: string[], update: Partial<Pick<PaymentOrderRow, 'status' | 'batchId' | 'txHash'>>) =>
    db.update(paymentOrders).set(update).where(inArray(paymentOrders.id, ids)).returning(),

  findByRef: (ref: string) =>
    db.select().from(paymentOrders).where(eq(paymentOrders.ref, ref)),

  createReceipt: (data: NewBatchReceipt) =>
    db.insert(batchReceipts).values(data).returning(),
}
