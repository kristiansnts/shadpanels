import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const ADMIN_EMAIL = 'shadpanel@admin.com'
const ADMIN_PASSWORD = 'admin'
const AUTH_COOKIE = 'shadpanel-auth'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  const { email, password } = credentials

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return {
      success: false,
      error: 'Invalid email or password'
    }
  }

  // Set authentication cookie
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  return {
    success: true
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE)
  return authCookie?.value === 'authenticated'
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE)
  return authCookie?.value === 'authenticated'
}

export function getAuthCookie(): string {
  return AUTH_COOKIE
}