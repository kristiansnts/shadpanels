import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    
    return NextResponse.json({
      isAuthenticated: authenticated
    })
  } catch (error) {
    console.error('Auth status check failed:', error)
    return NextResponse.json({
      isAuthenticated: false
    })
  }
}