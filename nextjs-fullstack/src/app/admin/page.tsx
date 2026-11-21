import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { query } from "@/lib/db";
import type { ContactInquiry, Project } from "@/types/portfolio";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [profile, projectsRes, inquiriesRes] = await Promise.all([
    getProfile(),
    query<Project>("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"),
    query<ContactInquiry>(
      "SELECT id, sender_name, sender_email, message, is_read, created_at FROM contact_inquiries ORDER BY created_at DESC"
    ),
  ]);

  return (
    <AdminClient
      initialProfile={profile}
      initialProjects={projectsRes.rows}
      initialInquiries={inquiriesRes.rows}
    />
  );
}
