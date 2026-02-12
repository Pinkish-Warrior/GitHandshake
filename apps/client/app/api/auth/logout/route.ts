import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const response = NextResponse.json({ status: "logged out" });
  const setCookie = res.headers.getSetCookie();
  for (const cookie of setCookie) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}
