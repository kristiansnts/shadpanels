import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple auth check without path alias since middleware runs at root level
function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const AUTH_COOKIE = 'shadpanel-auth'
  const authCookie = request.cookies.get(AUTH_COOKIE)
  
  // Must have cookie AND it must equal 'authenticated'
  const isAuth = authCookie?.value === 'authenticated'
  return isAuth
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = isAuthenticatedFromRequest(request)

  // Handle login pages - redirect to admin if already authenticated
  if (pathname === '/admin/login' || pathname === '/login') {
    if (isAuth) {
      // Redirect authenticated users to admin dashboard
      const adminUrl = new URL('/admin', request.url)
      return NextResponse.redirect(adminUrl)
    }
    // If accessing /login, redirect to /admin/login
    if (pathname === '/login') {
      const adminLoginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(adminLoginUrl)
    }
    return NextResponse.next()
  }

  // Check if the request is for admin routes - BLOCK if not authenticated
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