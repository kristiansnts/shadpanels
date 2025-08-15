import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticatedFromRequest } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Don't protect login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check if the request is for admin routes (except login)
  if (pathname.startsWith('/admin')) {
    const isAuth = isAuthenticatedFromRequest(request)
    
    if (!isAuth) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}