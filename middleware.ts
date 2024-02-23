import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("token")
  if (!token) {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/", req.url))
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/feed", req.url))
  }

}

export const config = {
  matcher: ['/', '/feed', '/user/:path*', '/search/:path*']
}