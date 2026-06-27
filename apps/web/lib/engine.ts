import { PaymentEngine } from '@riven/payment-engine'

let engine: PaymentEngine | null = null

export function getEngine(): PaymentEngine {
  if (!engine) {
    engine = new PaymentEngine({
      timeThresholdMs: 500,
      countThreshold: 50,
      amountThreshold: 1.00,
    })
    engine.start()
  }
  return engine
}
