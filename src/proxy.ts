import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (
    pathname === "/" ||
    pathname.startsWith("/api/users/login") ||
    pathname.startsWith("/api/users/register") ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    jwt.verify(token!, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
