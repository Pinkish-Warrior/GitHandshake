import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const res = await fetch(`${API_URL}/api/auth/status`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
