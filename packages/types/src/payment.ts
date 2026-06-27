export type PaymentDirection = 'in' | 'out'

export type PaymentOrderStatus = 'queued' | 'batched' | 'settled' | 'failed' | 'expired'

export interface PaymentOrder {
  orderId: string
  direction: PaymentDirection
  amount: number
  counterparty: string
  ref: string
  x402RequestId?: string
  queuedAt: number
  expiresAt: number
  status: PaymentOrderStatus
}

export interface BatchInstruction {
  from: string
  to: string
  amount: number
  ref: string
}

export interface BatchReceipt {
  batchId: string
  txHash: string
  ordersSettled: number
  totalAmount: number
  gasCost: number
  settledAt: number
  durationMs: number
  instructions: BatchInstruction[]
}

export interface NetResult {
  instructions: BatchInstruction[]
  netted: number
  savedGas: number
}

export interface FlushConfig {
  timeThresholdMs: number
  countThreshold: number
  amountThreshold: number
}
