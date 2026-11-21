import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { projectSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const includeAll = request.nextUrl.searchParams.get("all") === "1";
  if (includeAll && !getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = includeAll
    ? "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"
    : "SELECT * FROM projects WHERE is_published = TRUE ORDER BY sort_order ASC, created_at DESC";

  const { rows } = await query(sql);
  return NextResponse.json({ projects: rows });
}

export async function POST(request: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid project payload." },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO projects
       (title, category, problem, contribution, tech_stack, screenshot_url, github_url, live_demo_url, is_published, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      d.title,
      d.category,
      d.problem,
      d.contribution,
      d.tech_stack,
      d.screenshot_url,
      d.github_url,
      d.live_demo_url,
      d.is_published,
      d.sort_order,
    ]
  );

  return NextResponse.json({ project: rows[0] }, { status: 201 });
}
