'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { Spinner } from '../ui/Spinner'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  totalSpent?: number
}

interface Props {
  messages: ChatMessage[]
  loading: boolean
}

export function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-2 text-center'>
        <span className='text-3xl text-violet-400 select-none'>◈</span>
        <p className='text-zinc-500 text-sm'>Ask me to research, browse bounties, or check your wallet.</p>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4'>
      {messages.map(msg => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} totalSpent={msg.totalSpent} />
      ))}
      {loading && (
        <div className='flex justify-start'>
          <div className='flex items-center gap-2 px-4 py-2.5 bg-zinc-800 rounded-2xl rounded-bl-sm'>
            <Spinner size={14} />
            <span className='text-xs text-zinc-400'>Thinking...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}