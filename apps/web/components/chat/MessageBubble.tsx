interface Props {
  role: 'user' | 'assistant'
  content: string
  totalSpent?: number
}

export function MessageBubble({ role, content, totalSpent }: Props) {
  const isUser = role === 'user'
  return (
    <div className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
      <div className='flex flex-col gap-1 max-w-[80%]'>
        <div
          className={
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed ' +
            (isUser
              ? 'bg-violet-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm')
          }
        >
          {content}
        </div>
        {!isUser && totalSpent && totalSpent > 0 && (
          <span className='text-xs text-zinc-600 pl-1'>
            {/* dollar sign */ String.fromCharCode(36)}{totalSpent.toFixed(4)} spent
          </span>
        )}
      </div>
    </div>
  )
}