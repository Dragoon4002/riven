import type { AgentContext, TaskOutput } from '@riven/types'
import { ingestion } from '../seller/ingestion'
import { autoPricing } from '../seller/pricing'
import { publisher } from '../seller/publisher'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  try {
    const file = params['file'] as Blob | undefined
    const url = params['url'] as string | undefined

    const ingestResult = await ingestion({ file, url, userId: ctx.userId }, ctx)
    const { output: content } = ingestResult

    const pricingResult = await autoPricing({ content, authorReputation: 0.5 }, ctx)
    const price = pricingResult.output.suggestedPrice

    const pubResult = await publisher(
      {
        contentId: content.contentId,
        title: content.title,
        text: content.text,
        price,
        authorWallet: ctx.wallet.address,
        authorId: ctx.userId,
      },
      ctx,
    )

    const { x402Endpoint } = pubResult.output
    return {
      text: `Published "${content.title}" at $${price.toFixed(2)}/read. Your x402 endpoint: ${x402Endpoint}. Researchers will pay you automatically when they cite your work.`,
      data: { contentId: content.contentId, price, x402Endpoint },
    }
  } catch (err) {
    return {
      text: `Failed to publish: ${err instanceof Error ? err.message : String(err)}`,
    }
  }
}
