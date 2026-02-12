import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const res = await fetch(`${API_URL}/api/auth/github`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    redirect: "manual",
  });

  const location = res.headers.get("location");
  if (location) {
    const response = NextResponse.redirect(location);
    const setCookie = res.headers.getSetCookie();
    for (const cookie of setCookie) {
      response.headers.append("set-cookie", cookie);
    }
    return response;
  }

  return NextResponse.json({ error: "No redirect from auth" }, { status: 500 });
}
