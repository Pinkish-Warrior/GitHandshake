import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_URL}/api/auth/status`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      return NextResponse.json({ status: "unauthenticated" });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "unauthenticated" });
  }
}
