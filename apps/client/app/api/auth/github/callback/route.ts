import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const backendUrl = `${API_URL}/api/auth/github/callback${url.search}`;

  const res = await fetch(backendUrl, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "localhost:3000";
  const response = NextResponse.redirect(`${proto}://${host}/`);

  // Forward the Set-Cookie header from the backend (now a 200 JSON response)
  const setCookie = res.headers.getSetCookie();
  for (const cookie of setCookie) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}
