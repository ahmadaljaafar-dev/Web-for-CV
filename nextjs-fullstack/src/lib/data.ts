import { query } from "./db";
import type { Profile, Project } from "@/types/portfolio";

export async function getProfile(): Promise<Profile> {
  const { rows } = await query<Profile>(
    "SELECT id, full_name, professional_title, hero_headline, about_text, email, phone, skills_json, updated_at FROM profile WHERE id = 1"
  );
  if (rows.length > 0) return rows[0];

  return {
    id: 1,
    full_name: "Ahmad Sami Aljaafar",
    professional_title: "Full-Stack Developer & Automation Engineer",
    hero_headline: "I build web apps and automate the work behind them.",
    about_text:
      "I turn practical ideas into responsive websites, web and mobile applications, and automated workflows.",
    email: "ahmato-123@hotmail.com",
    phone: "71085511",
    skills_json: [],
    updated_at: new Date().toISOString(),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { rows } = await query<Project>(
    `SELECT id, title, category, problem, contribution, tech_stack, screenshot_url,
            github_url, live_demo_url, is_published, sort_order, created_at, updated_at
     FROM projects
     WHERE is_published = TRUE
     ORDER BY sort_order ASC, created_at DESC`
  );
  return rows;
}
