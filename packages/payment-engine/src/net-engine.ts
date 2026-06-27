import type { PaymentOrder, BatchInstruction, NetResult } from '@riven/types'

export class NetEngine {
  net(incoming: PaymentOrder[], outgoing: PaymentOrder[]): NetResult {
    const inByCounterparty = this.groupByCounterparty(incoming)
    const outByCounterparty = this.groupByCounterparty(outgoing)

    const instructions: BatchInstruction[] = []
    let netted = 0

    const allCounterparties = new Set([
      ...Object.keys(inByCounterparty),
      ...Object.keys(outByCounterparty),
    ])

    for (const counterparty of allCounterparties) {
      const inAmount = inByCounterparty[counterparty] ?? 0
      const outAmount = outByCounterparty[counterparty] ?? 0

      if (inAmount === 0 && outAmount === 0) continue

      const inOrders = incoming.filter(o => o.counterparty === counterparty)
      const outOrders = outgoing.filter(o => o.counterparty === counterparty)

      if (inAmount > 0 && outAmount > 0) {
        netted += inOrders.length + outOrders.length
        const delta = inAmount - outAmount
        if (Math.abs(delta) < 0.0001) continue
        if (delta > 0) {
          instructions.push({
            from: counterparty,
            to: 'SELF',
            amount: delta,
            ref: inOrders.map(o => o.ref).join(','),
          })
        } else {
          instructions.push({
            from: 'SELF',
            to: counterparty,
            amount: -delta,
            ref: outOrders.map(o => o.ref).join(','),
          })
        }
      } else if (outAmount > 0) {
        for (const order of outOrders) {
          instructions.push({
            from: 'SELF',
            to: order.counterparty,
            amount: order.amount,
            ref: order.ref,
          })
        }
      } else {
        for (const order of inOrders) {
          instructions.push({
            from: order.counterparty,
            to: 'SELF',
            amount: order.amount,
            ref: order.ref,
          })
        }
      }
    }

    return {
      instructions,
      netted,
      savedGas: netted * 0.001,
    }
  }

  private groupByCounterparty(orders: PaymentOrder[]): Record<string, number> {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.counterparty] = (acc[order.counterparty] ?? 0) + order.amount
      return acc
    }, {})
  }
}
