import type { AgentContext, AgentResult, UnlockedContent, Citation, Report } from '@riven/types'
import { llmText } from '../llm'

export interface SynthesisInput {
  content: UnlockedContent[]
  query: string
}

export async function synthesis(
  input: SynthesisInput,
  _ctx: AgentContext,
): Promise<AgentResult<Pick<Report, 'content' | 'citations'>>> {
  if (input.content.length === 0) {
    return { output: { content: 'No relevant sources found for your query. Try rephrasing.', citations: [] }, payments: [] }
  }

  const numberedSources = input.content
    .map((c, i) => `[${i + 1}] ${c.title}\n${c.content.slice(0, 800)}`)
    .join('\n\n')

  const llmResponse = await llmText({
    model: 'gemini-2.0-flash-exp',
    system: 'You are a research synthesizer. Write a clear, factual report using only the provided sources. Use [1], [2] etc. to cite. End with a ## Sources section listing each cited source by number and title.',
    prompt: `Research query: ${input.query}\n\nSources:\n${numberedSources}`,
  })

  const citations: Citation[] = input.content.map((c, i) => ({
    id: `cit_${i}`,
    reportId: '',
    sourceId: c.sourceId,
    amount: 0.02,
    txHash: '',
  }))

  return { output: { content: llmResponse, citations }, payments: [] }
}
