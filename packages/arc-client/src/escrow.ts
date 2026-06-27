import type { EscrowInfo } from '@riven/types'

export interface EscrowLockResult {
  escrowId: string
  escrowAddress: string
  lockedAmount: number
}

export interface EscrowReleaseResult {
  txHash: string
  amount: number
  recipient: string
}

export interface EscrowRefundResult {
  txHash: string
  amount: number
  returnedTo: string
}

export const EscrowClient = {
  lock: async (from: string, amount: number, jobId: string): Promise<EscrowLockResult> => {
    console.log('[arc-client:stub] EscrowClient.lock', { from, amount, jobId })
    return {
      escrowId: `escrow_${jobId}_${Date.now()}`,
      escrowAddress: `0xESCROW_${jobId}`,
      lockedAmount: amount,
    }
  },

  release: async (escrowId: string, to: string): Promise<EscrowReleaseResult> => {
    console.log('[arc-client:stub] EscrowClient.release', { escrowId, to })
    return {
      txHash: `0xRELEASE_${escrowId}`,
      amount: 50,
      recipient: to,
    }
  },

  refund: async (escrowId: string): Promise<EscrowRefundResult> => {
    console.log('[arc-client:stub] EscrowClient.refund', escrowId)
    return {
      txHash: `0xREFUND_${escrowId}`,
      amount: 50,
      returnedTo: '0xORIGINAL_SENDER',
    }
  },

  status: async (escrowId: string): Promise<EscrowInfo> => {
    console.log('[arc-client:stub] EscrowClient.status', escrowId)
    return {
      escrowId,
      escrowAddress: `0xESCROW_${escrowId}`,
      lockedAmount: 50,
      state: 'locked',
      createdAt: Date.now() - 60_000,
    }
  },
}
