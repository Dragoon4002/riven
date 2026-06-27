import type { BatchInstruction, BatchReceipt } from '@riven/types'

export interface GatewaySubmitResult {
  batchId: string
  txHash: string
  gasCost: number
}

export const GatewayClient = {
  submitBatch: async (instructions: BatchInstruction[]): Promise<BatchReceipt> => {
    console.log('[arc-client:stub] GatewayClient.submitBatch', instructions.length, 'instructions')
    const total = instructions.reduce((sum, i) => sum + i.amount, 0)
    await new Promise(r => setTimeout(r, 50))
    return {
      batchId: `gw_batch_${Date.now()}`,
      txHash: `0xGW_TX_${Date.now()}`,
      ordersSettled: instructions.length,
      totalAmount: total,
      gasCost: 0,
      settledAt: Date.now(),
      durationMs: 50,
      instructions,
    }
  },
}
