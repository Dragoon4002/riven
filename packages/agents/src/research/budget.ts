import type { AgentContext, AgentResult, RankedSource, Source } from '@riven/types'

export interface BudgetInput {
  ranked: RankedSource[]
  dailyCap: number
  perQueryCap: number
}

export interface BudgetOutput {
  approved: Source[]
  rejected: Source[]
  estimatedCost: number
}

const EFFICIENCY_THRESHOLD = 2.0

export async function budget(
  input: BudgetInput,
  _ctx: AgentContext,
): Promise<AgentResult<BudgetOutput>> {
  console.log('[agent:stub] BudgetAgent', input.ranked.length, 'candidates')
  let totalCost = 0
  const approved: Source[] = []
  const rejected: Source[] = []

  for (const source of input.ranked) {
    if (
      source.costEfficiency >= EFFICIENCY_THRESHOLD &&
      totalCost + source.price <= input.perQueryCap
    ) {
      approved.push(source)
      totalCost += source.price
    } else {
      rejected.push(source)
    }
  }

  return { output: { approved, rejected, estimatedCost: totalCost }, payments: [] }
}
