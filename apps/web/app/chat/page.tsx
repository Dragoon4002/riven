'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageList, type ChatMessage } from '../../components/chat/MessageList'
import { ChatInput } from '../../components/chat/ChatInput'
import { useUser } from '../../context/UserContext'
import { getSessionId } from '../../lib/user'

export default function ChatPage() {
  const { userId } = useUser()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  async function send(message: string) {
    if (!userId) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: message }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId: getSessionId(), userId }),
      })
      const data = await res.json() as { text: string; totalSpent?: number }
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.ok ? data.text : 'Something went wrong. Try again.',
        totalSpent: data.totalSpent,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Failed to connect. Check your connection.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-screen flex-col bg-zinc-950'>
      {/* Top bar */}
      <header className='flex items-center justify-between border-b border-zinc-800 px-4 py-3 flex-shrink-0'>
        <div className='flex items-center gap-2'>
          <span className='text-violet-400 select-none'>◈</span>
          <span className='text-sm font-semibold text-zinc-100'>Riven</span>
        </div>
        <Link
          href='/settings'
          className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100'
          aria-label='Settings'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
            <circle cx='12' cy='12' r='3'/>
            <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'/>
          </svg>
        </Link>
      </header>

      {/* Messages */}
      <MessageList messages={messages} loading={loading} />

      {/* Input */}
      <ChatInput onSend={send} disabled={loading || !userId} />
    </div>
  )
}