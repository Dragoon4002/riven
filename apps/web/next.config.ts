import type { NextConfig } from 'next'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load env from monorepo root
try {
  const envPath = resolve(process.cwd(), '../../.env')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const idx = line.indexOf('=')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const val = line.slice(idx + 1).trim()
    if (key && !process.env[key]) process.env[key] = val
  }
} catch {}

const nextConfig: NextConfig = {
  serverExternalPackages: ['@neondatabase/serverless', 'ioredis'],
}

export default nextConfig