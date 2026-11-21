import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows } = await query(
    `SELECT id, sender_name, sender_email, message, is_read, created_at
     FROM contact_inquiries
     ORDER BY created_at DESC`
  );
  return NextResponse.json({ inquiries: rows });
}

export async function PATCH(request: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.id || typeof body?.is_read !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await query("UPDATE contact_inquiries SET is_read = $1 WHERE id = $2", [
    body.is_read,
    body.id,
  ]);
  return NextResponse.json({ ok: true });
}
