import type { PaymentOrder } from '@riven/types'

export class OrderBook {
  private incoming = new Map<string, PaymentOrder>()
  private outgoing = new Map<string, PaymentOrder>()

  push(order: PaymentOrder): void {
    if (order.direction === 'in') {
      this.incoming.set(order.orderId, order)
    } else {
      this.outgoing.set(order.orderId, order)
    }
  }

  pop(direction: 'in' | 'out'): PaymentOrder[] {
    const map = direction === 'in' ? this.incoming : this.outgoing
    const orders = Array.from(map.values())
    map.clear()
    return orders
  }

  size(direction?: 'in' | 'out'): number {
    if (direction === 'in') return this.incoming.size
    if (direction === 'out') return this.outgoing.size
    return this.incoming.size + this.outgoing.size
  }

  totalAmount(direction?: 'in' | 'out'): number {
    if (direction === 'in') {
      return Array.from(this.incoming.values()).reduce((s, o) => s + o.amount, 0)
    }
    if (direction === 'out') {
      return Array.from(this.outgoing.values()).reduce((s, o) => s + o.amount, 0)
    }
    return this.totalAmount('in') + this.totalAmount('out')
  }

  expire(): number {
    const now = Date.now()
    let expired = 0
    for (const [id, order] of this.incoming) {
      if (order.expiresAt < now) { this.incoming.delete(id); expired++ }
    }
    for (const [id, order] of this.outgoing) {
      if (order.expiresAt < now) { this.outgoing.delete(id); expired++ }
    }
    return expired
  }
}
