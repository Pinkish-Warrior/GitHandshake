import { NextRequest, NextResponse } from "next/server";
import * as https from "https";
import * as http from "http";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type RedirectResult = { location: string | null; cookies: string[] };

// fetch() with redirect:"manual" returns an opaque redirect in Node.js (status 0,
// headers empty per WHATWG spec), so we use the http/https module directly to read
// the Location header from the server's 302 response.
function getRedirect(url: string, cookieHeader: string): Promise<RedirectResult> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: { cookie: cookieHeader },
      },
      (res) => {
        const location = typeof res.headers.location === "string" ? res.headers.location : null;
        const raw = res.headers["set-cookie"];
        const cookies = Array.isArray(raw) ? raw : raw ? [raw] : [];
        resolve({ location, cookies });
        res.destroy();
      },
    );
    req.on("error", reject);
    req.end();
  });
}

export async function GET(req: NextRequest) {
  try {
    const { location, cookies } = await getRedirect(
      `${API_URL}/api/auth/github`,
      req.headers.get("cookie") || "",
    );

    if (location) {
      const response = NextResponse.redirect(location);
      for (const cookie of cookies) {
        response.headers.append("set-cookie", cookie);
      }
      return response;
    }
  } catch (err) {
    console.error("[auth] Failed to reach auth server:", err);
  }

  return NextResponse.json({ error: "No redirect from auth" }, { status: 500 });
}
