import { z } from 'zod'
import type { AgentContext, AgentResult, ExtractedContent } from '@riven/types'
import { llmObject } from '../llm'

export interface PricingInput {
  content: ExtractedContent
  authorReputation: number
}

export interface PricingOutput {
  suggestedPrice: number
  reasoning: string
}

const schema = z.object({
  suggestedPrice: z.number().min(0.01).max(0.08),
  reasoning: z.string(),
})

export async function autoPricing(
  input: PricingInput,
  _ctx: AgentContext,
): Promise<AgentResult<PricingOutput>> {
  const output = await llmObject({
    model: 'gemini-2.0-flash-exp',
    system:
      'You are a content pricing agent. Price research content for citation payments. Prices range $0.01–$0.08 per read. Higher price for longer, more specialized, higher-reputation content.',
    prompt: `Word count: ${input.content.wordCount}
Topics: ${input.content.topics.join(', ')}
Author reputation: ${input.authorReputation}
Preview: ${input.content.text.slice(0, 200)}`,
    schema,
  })

  return { output, payments: [] }
}
