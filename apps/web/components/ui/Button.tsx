import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary: 'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
    outline: 'border border-zinc-700 text-zinc-200 hover:bg-zinc-800',
  }
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' }
  const cls = [base, variants[variant] ?? '', sizes[size] ?? '', className].join(' ')

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading && <SpinIcon />}
      {children}
    </button>
  )
}

function SpinIcon() {
  return (
    <svg width={14} height={14} viewBox='0 0 24 24' fill='none' className='animate-spin'>
      <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='3' strokeOpacity='0.2' />
      <path d='M12 2a10 10 0 0 1 10 10' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
    </svg>
  )
}