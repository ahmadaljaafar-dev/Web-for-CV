import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { projectSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid update payload." },
      { status: 400 }
    );
  }

  const existing = await query("SELECT * FROM projects WHERE id = $1", [params.id]);
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const merged = { ...existing.rows[0], ...parsed.data };
  const { rows } = await query(
    `UPDATE projects
     SET title = $1,
         category = $2,
         problem = $3,
         contribution = $4,
         tech_stack = $5,
         screenshot_url = $6,
         github_url = $7,
         live_demo_url = $8,
         is_published = $9,
         sort_order = $10,
         updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      merged.title,
      merged.category,
      merged.problem,
      merged.contribution,
      merged.tech_stack,
      merged.screenshot_url,
      merged.github_url,
      merged.live_demo_url,
      merged.is_published,
      merged.sort_order,
      params.id,
    ]
  );

  return NextResponse.json({ project: rows[0] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await query("DELETE FROM projects WHERE id = $1", [params.id]);
  return NextResponse.json({ ok: true });
}
