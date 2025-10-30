import { NextResponse, type NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

function verifyTokenEdge(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()
  
  const token = request.cookies.get('auth-token')?.value
  const user = token ? verifyTokenEdge(token) : null

  // Redirect unauthenticated users to login
  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}
