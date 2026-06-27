import type { FlushConfig } from '@riven/types'
import type { OrderBook } from './order-book'

export class FlushTrigger {
  private lastFlushAt = Date.now()
  private timer: ReturnType<typeof setInterval> | null = null

  constructor(private config: FlushConfig) {}

  shouldFlush(book: OrderBook): boolean {
    const now = Date.now()
    const timePassed = now - this.lastFlushAt >= this.config.timeThresholdMs
    const countHit = book.size() >= this.config.countThreshold
    const amountHit = book.totalAmount() >= this.config.amountThreshold
    return timePassed || countHit || amountHit
  }

  start(onFlush: () => void, book: OrderBook): void {
    if (this.timer) return
    this.timer = setInterval(() => {
      if (this.shouldFlush(book)) {
        this.lastFlushAt = Date.now()
        onFlush()
      }
    }, Math.min(this.config.timeThresholdMs, 100))
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  markFlushed(): void {
    this.lastFlushAt = Date.now()
  }
}
