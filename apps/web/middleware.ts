import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const userId = req.cookies.get('riven_user')?.value
  const { pathname } = req.nextUrl

  if (userId && (pathname === '/' || pathname === '/onboarding')) {
    return NextResponse.redirect(new URL('/chat', req.url))
  }

  if (!userId && (pathname.startsWith('/chat') || pathname.startsWith('/settings'))) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/onboarding', '/chat/:path*', '/settings/:path*'],
}
