import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const backendUrl = `${API_URL}/api/auth/github/callback${url.search}`;

  const res = await fetch(backendUrl, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    redirect: "manual",
  });

  const response = NextResponse.redirect(
    new URL("/", req.url),
  );

  // Forward the Set-Cookie header from the backend
  const setCookie = res.headers.getSetCookie();
  for (const cookie of setCookie) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}
