import { NextRequest, NextResponse } from "next/server";
import { hashIp } from "@/lib/auth";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const maxReq = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5);
  const windowMin = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES || 15);
  const ipHash = hashIp(ip);

  const rate = await checkRateLimit(`contact:${ipHash}`, maxReq, windowMin);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `Too many messages sent recently. Please retry in ${Math.ceil(
          rate.retryAfterSeconds / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Please check all fields." },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;
  const { rows } = await query(
    `INSERT INTO contact_inquiries (sender_name, sender_email, message, ip_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [name, email, message, ipHash]
  );

  return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
}
