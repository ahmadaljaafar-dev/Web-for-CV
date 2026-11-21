import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  hashIp,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rate = await checkRateLimit(`login:${hashIp(ip)}`, 10, 15);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!expectedEmail || !expectedHash) {
    return NextResponse.json(
      { error: "Admin credentials are not configured in environment variables." },
      { status: 500 }
    );
  }

  if (email !== expectedEmail || !verifyPassword(password, expectedHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = createSessionToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
