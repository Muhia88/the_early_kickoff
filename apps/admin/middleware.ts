import { auth } from "@the-early-kickoff/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const reqUrl = new URL(req.url);
  if (!req.auth && reqUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.auth && req.auth.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admin users
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};