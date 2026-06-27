import type { PaymentOrder, BatchReceipt, FlushConfig } from '@riven/types'
import { OrderBook } from './order-book'
import { NetEngine } from './net-engine'
import { FlushTrigger } from './flush-trigger'
import { BatchSettler } from './batch-settler'

const DEFAULT_CONFIG: FlushConfig = {
  timeThresholdMs: 500,
  countThreshold: 50,
  amountThreshold: 1.00,
}

type SettleCallback = (receipt: BatchReceipt) => void

export class PaymentEngine {
  private book = new OrderBook()
  private netEngine = new NetEngine()
  private settler = new BatchSettler()
  private trigger: FlushTrigger
  private listeners: SettleCallback[] = []
  private flushing = false

  constructor(config: FlushConfig = DEFAULT_CONFIG) {
    this.trigger = new FlushTrigger(config)
  }

  start(): void {
    this.trigger.start(() => this.flush(), this.book)
  }

  stop(): void {
    this.trigger.stop()
  }

  push(order: PaymentOrder): void {
    this.book.push(order)
  }

  onSettle(callback: SettleCallback): void {
    this.listeners.push(callback)
  }

  status(): { queueSize: number; pendingAmount: number } {
    return {
      queueSize: this.book.size(),
      pendingAmount: this.book.totalAmount(),
    }
  }

  private async flush(): Promise<void> {
    if (this.flushing) return
    this.flushing = true

    try {
      this.book.expire()

      if (this.book.size() === 0) return

      const incoming = this.book.pop('in')
      const outgoing = this.book.pop('out')
      const { instructions } = this.netEngine.net(incoming, outgoing)

      if (instructions.length === 0) return

      const receipt = await this.settler.settle(instructions)
      this.trigger.markFlushed()

      for (const listener of this.listeners) {
        listener(receipt)
      }
    } finally {
      this.flushing = false
    }
  }
}
