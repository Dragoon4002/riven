'use client'

import { KeyboardEvent, useRef, useState } from 'react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  function submit() {
    const msg = value.trim()
    if (!msg || disabled) return
    setValue('')
    if (ref.current) { ref.current.style.height = 'auto' }
    onSend(msg)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    }
  }

  function onInput() {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  return (
    <div className='border-t border-zinc-800 bg-zinc-950 px-4 py-3'>
      <div className='flex items-end gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 focus-within:border-zinc-600 transition-colors'>
        <textarea
          ref={ref}
          value={value}
          onChange={e => setValue(e.target.value)}
          onInput={onInput}
          onKeyDown={onKeyDown}
          placeholder='Ask me anything...'
          rows={1}
          disabled={disabled}
          className='flex-1 resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-40'
          style={{ maxHeight: '160px' }}
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M12 19V5M5 12l7-7 7 7' />
          </svg>
        </button>
      </div>
      <p className='mt-1.5 text-center text-xs text-zinc-700'>Cmd+Enter to send</p>
    </div>
  )
}