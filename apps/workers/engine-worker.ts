import { PaymentEngine } from '@riven/payment-engine'
import { PaymentQueries } from '@riven/db'

const engine = new PaymentEngine({
  timeThresholdMs: 500,
  countThreshold: 50,
  amountThreshold: 1.00,
})

engine.onSettle(async (receipt) => {
  console.log('[engine-worker] batch settled', {
    batchId: receipt.batchId,
    count: receipt.ordersSettled,
    total: receipt.totalAmount,
    durationMs: receipt.durationMs,
  })

  await PaymentQueries.createReceipt({
    id: receipt.batchId,
    txHash: receipt.txHash,
    ordersSettled: receipt.ordersSettled,
    totalAmount: receipt.totalAmount,
    gasCost: receipt.gasCost,
    settledAt: new Date(receipt.settledAt),
    durationMs: receipt.durationMs,
  })

  await PaymentQueries.updateOrdersBatch(
    receipt.instructions.map(i => i.ref),
    { status: 'settled', batchId: receipt.batchId, txHash: receipt.txHash },
  )
})

engine.start()
console.log('[engine-worker] payment engine started')

process.on('SIGTERM', () => {
  engine.stop()
  console.log('[engine-worker] stopped')
  process.exit(0)
})
