import type { BatchInstruction, BatchReceipt } from '@riven/types'
import { GatewayClient } from '@riven/arc-client'

export class BatchSettler {
  async settle(instructions: BatchInstruction[]): Promise<BatchReceipt> {
    if (instructions.length === 0) {
      return {
        batchId: `empty_${Date.now()}`,
        txHash: '',
        ordersSettled: 0,
        totalAmount: 0,
        gasCost: 0,
        settledAt: Date.now(),
        durationMs: 0,
        instructions: [],
      }
    }

    const start = Date.now()
    const receipt = await GatewayClient.submitBatch(instructions)
    const durationMs = Date.now() - start

    return { ...receipt, durationMs }
  }
}
