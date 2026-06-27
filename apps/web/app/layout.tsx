import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { UserProvider } from '../context/UserContext'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Riven',
  description: 'Research. Bounties. Paid instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable + ' h-full'}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
