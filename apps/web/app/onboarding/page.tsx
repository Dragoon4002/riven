'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/Button'
import { setStoredUser } from '../../lib/user'
import { useUser } from '../../context/UserContext'

type Step = 'wallet' | 'github'

export default function OnboardingPage() {
  const router = useRouter()
  const { refresh } = useUser()
  const [step, setStep] = useState<Step>('wallet')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function createWallet() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wallet/create', { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json() as { userId: string; address: string; balance: number }
      setStoredUser({ userId: data.userId, address: data.address, balance: data.balance })
      setUserId(data.userId)
      await refresh()
      setStep('github')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function connectGithub() {
    window.location.href = '/api/github/oauth?state=' + userId
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4'>
      <div className='w-full max-w-sm space-y-8'>
        <div className='flex items-center gap-2'>
          <div className={'h-1 flex-1 rounded-full bg-violet-500'} />
          <div className={'h-1 flex-1 rounded-full ' + (step === 'github' ? 'bg-violet-500' : 'bg-zinc-800')} />
        </div>

        {step === 'wallet' && (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-xl font-semibold text-zinc-100'>Create your wallet</h1>
              <p className='text-sm text-zinc-400'>Your wallet is your identity. Takes 2 seconds.</p>
            </div>
            {error && <p className='text-sm text-red-400'>{error}</p>}
            <Button onClick={createWallet} loading={loading} className='w-full justify-center py-2.5'>
              Create wallet
            </Button>
          </div>
        )}

        {step === 'github' && (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-xl font-semibold text-zinc-100'>Connect GitHub</h1>
              <p className='text-sm text-zinc-400'>Required to create bounties and submit solutions. Connect later in settings.</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Button onClick={connectGithub} className='w-full justify-center py-2.5'>
                Connect GitHub
              </Button>
              <button onClick={() => router.push('/chat')} className='text-sm text-zinc-500 hover:text-zinc-300 transition-colors text-center'>
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}