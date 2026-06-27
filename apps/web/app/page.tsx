import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4'>
      <div className='flex flex-col items-center gap-8 text-center'>
        <div className='flex items-center gap-3'>
          <span className='text-violet-400 text-2xl select-none'>◈</span>
          <span className='text-zinc-100 text-3xl font-semibold tracking-tight'>Riven</span>
        </div>

        <p className='max-w-sm text-zinc-400 text-lg leading-relaxed'>
          Research. Bounties. Paid instantly.
        </p>

        <div className='flex flex-col items-center gap-3'>
          <Link
            href='/onboarding'
            className='inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 active:bg-violet-700'
          >
            Get started
          </Link>
          <span className='text-zinc-600 text-xs'>No email. No password.</span>
        </div>
      </div>

      <div className='absolute bottom-8 flex gap-6 text-xs text-zinc-700'>
        <span>Research</span>
        <span>Bounties</span>
        <span>Payments</span>
      </div>
    </div>
  )
}