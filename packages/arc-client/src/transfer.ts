import type { BatchInstruction, BatchReceipt } from '@riven/types'

export interface TransferResult {
  txHash: string
  settledAt: number
  durationMs: number
}

export const TransferClient = {
  send: async (from: string, to: string, amount: number): Promise<TransferResult> => {
    console.log('[arc-client:stub] TransferClient.send', { from, to, amount })
    return {
      txHash: `0xTX_STUB_${Date.now()}`,
      settledAt: Date.now(),
      durationMs: 120,
    }
  },

  sendBatch: async (instructions: BatchInstruction[]): Promise<BatchReceipt> => {
    console.log('[arc-client:stub] TransferClient.sendBatch', instructions.length, 'instructions')
    const total = instructions.reduce((sum, i) => sum + i.amount, 0)
    return {
      batchId: `batch_stub_${Date.now()}`,
      txHash: `0xTX_BATCH_STUB_${Date.now()}`,
      ordersSettled: instructions.length,
      totalAmount: total,
      gasCost: 0,
      settledAt: Date.now(),
      durationMs: 200,
      instructions,
    }
  },
}
