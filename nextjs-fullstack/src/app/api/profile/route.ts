import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { query } from "@/lib/db";
import { profileSchema } from "@/lib/validation";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid profile payload." },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const { rows } = await query(
    `UPDATE profile
     SET full_name = $1,
         professional_title = $2,
         hero_headline = $3,
         about_text = $4,
         email = $5,
         phone = $6,
         skills_json = $7::jsonb,
         updated_at = NOW()
     WHERE id = 1
     RETURNING *`,
    [
      d.full_name,
      d.professional_title,
      d.hero_headline,
      d.about_text,
      d.email,
      d.phone,
      JSON.stringify(d.skills_json),
    ]
  );

  return NextResponse.json({ profile: rows[0] });
}
