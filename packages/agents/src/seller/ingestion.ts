import type { AgentContext, AgentResult, ExtractedContent } from '@riven/types'
import { llmText, sanitize } from '../llm'

export interface IngestionInput {
  file?: Blob | undefined
  url?: string | undefined
  userId: string
}

export async function ingestion(
  input: IngestionInput,
  _ctx: AgentContext,
): Promise<AgentResult<ExtractedContent>> {
  if (!input.url) {
    const text = input.file
      ? 'File uploads are not yet supported. Please provide a URL instead.'
      : 'No content source provided.'
    throw new Error(text)
  }

  const res = await fetch(input.url)
  const html = await res.text()

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    ?? html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const title = titleMatch?.[1]?.trim() ?? input.url

  const raw = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const text = sanitize(raw, 10000)

  const topicsRaw = await llmText({
    prompt: `List 3-5 topic keywords for this content as comma-separated values, nothing else: ${text.slice(0, 500)}`,
  })
  const topics = topicsRaw.split(',').map((t) => t.trim()).filter(Boolean)

  return {
    output: {
      contentId: crypto.randomUUID(),
      text,
      title,
      author: input.userId,
      wordCount: text.split(/\s+/).length,
      topics,
    },
    payments: [],
  }
}
