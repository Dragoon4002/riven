import { NextRequest, NextResponse } from 'next/server'
import { UserQueries } from '@riven/db'

const GITHUB_CLIENT_ID = process.env['GITHUB_CLIENT_ID']!
const GITHUB_CLIENT_SECRET = process.env['GITHUB_CLIENT_SECRET']!
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('state')

  if (!code || !userId) {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${APP_URL}/api/github/oauth`,
      scope: 'read:user repo',
    })
    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`)
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code }),
  })
  const tokenData = await tokenRes.json() as { access_token?: string }
  if (!tokenData.access_token) {
    return NextResponse.json({ error: 'GitHub OAuth failed' }, { status: 400 })
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const githubUser = await userRes.json() as { id: number; login: string }

  await UserQueries.updateGithub(userId, String(githubUser.id))

  return NextResponse.redirect(`${APP_URL}/chat?github=connected`)
}
