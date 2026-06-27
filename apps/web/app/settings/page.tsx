'use client'

import Link from 'next/link'
import { useUser } from '../../context/UserContext'

function truncate(addr: string) {
  if (!addr) return ''
  return addr.slice(0, 8) + '...' + addr.slice(-6)
}

export default function SettingsPage() {
  const { address, balance, githubConnected, userId } = useUser()

  function connectGithub() {
    if (userId) window.location.href = '/api/github/oauth?state=' + userId
  }

  return (
    <div className='flex min-h-screen flex-col bg-zinc-950 px-4 py-8'>
      <div className='mx-auto w-full max-w-md space-y-8'>

        {/* Back */}
        <Link
          href='/chat'
          className='inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors'
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M19 12H5M12 5l-7 7 7 7'/>
          </svg>
          Back to chat
        </Link>

        <h1 className='text-lg font-semibold text-zinc-100'>Settings</h1>

        {/* Wallet */}
        <section className='rounded-xl border border-zinc-800 p-5 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-medium text-zinc-100'>Wallet</h2>
            <span className='rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400'>Connected</span>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-500'>Address</span>
              <span className='font-mono text-xs text-zinc-300'>{address ? truncate(address) : '—'}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-500'>Balance</span>
              <span className='text-xs text-zinc-100'>
                {typeof balance === 'number' ? balance.toFixed(2) + ' USDC' : '—'}
              </span>
            </div>
          </div>
        </section>

        {/* GitHub */}
        <section className='rounded-xl border border-zinc-800 p-5 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-medium text-zinc-100'>GitHub</h2>
            {githubConnected ? (
              <span className='rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400'>Connected</span>
            ) : (
              <span className='rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500'>Not connected</span>
            )}
          </div>
          {!githubConnected && (
            <div className='space-y-2'>
              <p className='text-xs text-zinc-500'>Connect to create bounties and submit solutions.</p>
              <button
                onClick={connectGithub}
                className='inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-zinc-800'
              >
                <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/>
                </svg>
                Connect GitHub
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}