import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticatedFromRequest } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = isAuthenticatedFromRequest(request)

  // Handle login page - redirect to admin if already authenticated
  if (pathname === '/admin/login' || pathname === '/login') {
    if (isAuth) {
      // Redirect authenticated users to admin dashboard
      const adminUrl = new URL('/admin', request.url)
      return NextResponse.redirect(adminUrl)
    }
    return NextResponse.next()
  }

  // Check if the request is for admin routes (except login)
  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      // Redirect unauthenticated users to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
}