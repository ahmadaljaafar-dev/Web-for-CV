"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ContactInquiry, Profile, Project, ProjectCategory } from "@/types/portfolio";

export function AdminClient({
  initialProfile,
  initialProjects,
  initialInquiries,
}: {
  initialProfile: Profile;
  initialProjects: Project[];
  initialInquiries: ContactInquiry[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"projects" | "profile" | "inbox">("projects");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [notice, setNotice] = useState("");

  // New project form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Web Development");
  const [problem, setProblem] = useState("");
  const [contribution, setContribution] = useState("");
  const [techInput, setTechInput] = useState("Next.js, TypeScript");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.url) {
      setScreenshotUrl(data.url);
      setNotice("Screenshot uploaded.");
    } else {
      setNotice(data.error || "Upload failed.");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        problem,
        contribution,
        tech_stack: techInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        screenshot_url: screenshotUrl || null,
        github_url: githubUrl || null,
        live_demo_url: liveDemoUrl || null,
        is_published: isPublished,
        sort_order: projects.length + 1,
      }),
    });
    const data = await res.json();
    if (res.ok && data.project) {
      setProjects([data.project, ...projects]);
      setTitle("");
      setProblem("");
      setContribution("");
      setGithubUrl("");
      setLiveDemoUrl("");
      setScreenshotUrl("");
      setNotice("Project created.");
    } else {
      setNotice(data.error || "Could not create project.");
    }
  };

  const togglePublish = async (project: Project) => {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !project.is_published }),
    });
    const data = await res.json();
    if (res.ok && data.project) {
      setProjects(projects.map((p) => (p.id === project.id ? data.project : p)));
      setNotice(
        data.project.is_published ? "Project published to portfolio." : "Project unpublished."
      );
    }
  };

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
      setNotice("Project deleted.");
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (res.ok && data.profile) {
      setProfile(data.profile);
      setNotice("Profile saved.");
    } else {
      setNotice(data.error || "Could not save profile.");
    }
  };

  const toggleInquiryRead = async (inq: ContactInquiry) => {
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inq.id, is_read: !inq.is_read }),
    });
    if (res.ok) {
      setInquiries(
        inquiries.map((item) =>
          item.id === inq.id ? { ...item, is_read: !inq.is_read } : item
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-graphite-950 text-warm-white">
      <header className="border-b border-graphite-800 bg-graphite-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-electric-glow">
              Admin CMS
            </span>
            <Link href="/" className="text-sm text-warm-muted hover:text-warm-white">
              View Public Site ↗
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-graphite-700 px-3 py-1.5 font-mono text-xs text-warm-muted hover:text-warm-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {notice && (
          <div className="mb-6 rounded-xl border border-electric/40 bg-electric/10 px-4 py-3 text-sm text-electric-bright">
            {notice}
          </div>
        )}

        <div className="mb-8 flex gap-2 border-b border-graphite-800 pb-4">
          {(["projects", "profile", "inbox"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider ${
                tab === t
                  ? "bg-electric text-white"
                  : "border border-graphite-700 bg-graphite-900 text-warm-muted"
              }`}
            >
              {t === "inbox" ? `Inbox (${inquiries.filter((i) => !i.is_read).length})` : t}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <div className="grid gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleCreateProject}
              className="space-y-4 rounded-2xl border border-graphite-700 bg-graphite-900 p-6 lg:col-span-5"
            >
              <h2 className="text-lg font-semibold">Add Project</h2>
              <input
                required
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="n8n Automation">n8n Automation</option>
              </select>
              <textarea
                required
                rows={2}
                placeholder="Problem solved"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <textarea
                required
                rows={2}
                placeholder="Your contribution"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <input
                placeholder="Tech stack (comma-separated)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <input
                placeholder="GitHub URL (optional)"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <input
                placeholder="Live Demo URL (optional)"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <div>
                <label className="block font-mono text-xs text-warm-muted">
                  Screenshot (PNG/JPG/WebP)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                  className="mt-1 text-xs text-warm-muted"
                />
                {screenshotUrl && (
                  <p className="mt-1 font-mono text-[11px] text-electric-bright">
                    Uploaded: {screenshotUrl}
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                Publish immediately
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-electric px-4 py-2.5 text-sm font-medium text-white"
              >
                Create Project
              </button>
            </form>

            <div className="space-y-4 lg:col-span-7">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-graphite-700 bg-graphite-900 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                          p.is_published
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-graphite-700 text-warm-muted"
                        }`}
                      >
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="font-mono text-xs text-electric-glow">{p.category}</span>
                    </div>
                    <h3 className="mt-1 font-semibold">{p.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublish(p)}
                      className="rounded-lg border border-graphite-600 px-3 py-1.5 font-mono text-xs hover:border-electric"
                    >
                      {p.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(p.id)}
                      className="rounded-lg border border-rose-500/40 px-3 py-1.5 font-mono text-xs text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <form
            onSubmit={saveProfile}
            className="max-w-2xl space-y-4 rounded-2xl border border-graphite-700 bg-graphite-900 p-6"
          >
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <input
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
            />
            <input
              value={profile.professional_title}
              onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
              className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
            />
            <input
              value={profile.hero_headline}
              onChange={(e) => setProfile({ ...profile, hero_headline: e.target.value })}
              className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
            />
            <textarea
              rows={4}
              value={profile.about_text}
              onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
              className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-electric px-5 py-2.5 text-sm font-medium text-white"
            >
              Save Profile
            </button>
          </form>
        )}

        {tab === "inbox" && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-graphite-700 bg-graphite-900 p-8 text-center text-sm text-warm-muted">
                No contact inquiries yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-2xl border border-graphite-700 bg-graphite-900 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-warm-white">{inq.sender_name}</span>
                      <span className="ml-3 font-mono text-xs text-electric-bright">
                        {inq.sender_email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleInquiryRead(inq)}
                      className="rounded border border-graphite-600 px-2.5 py-1 font-mono text-[11px]"
                    >
                      {inq.is_read ? "Mark unread" : "Mark read"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-warm-muted">{inq.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
