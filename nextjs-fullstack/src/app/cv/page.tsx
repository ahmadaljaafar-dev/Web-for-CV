import Link from "next/link";
import { getProfile, getPublishedProjects } from "@/lib/data";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function PrintableCvPage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
  ]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="no-print border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            ← Back to Portfolio
          </Link>
          <PrintButton />
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <header className="border-b-2 border-gray-900 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            {profile.full_name}
          </h1>
          <p className="mt-1 text-base font-medium text-gray-700">
            {profile.professional_title}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
            <span>Email: {profile.email}</span>
            <span>Phone: {profile.phone}</span>
            <span>WhatsApp: {profile.phone}</span>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Profile
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-800">
            {profile.about_text}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Skills
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {profile.skills_json.map((skill) => (
              <div key={skill.group} className="border-l-2 border-gray-300 pl-3">
                <h3 className="text-sm font-semibold text-gray-900">{skill.group}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-700">
                  {skill.description}
                </p>
                {skill.technologies.length > 0 && (
                  <p className="mt-1 font-mono text-[11px] text-gray-600">
                    {skill.technologies.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Published Projects
          </h2>
          <div className="mt-3 space-y-4">
            {projects.map((project) => (
              <article key={project.id} className="border-b border-gray-200 pb-4 last:border-none">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-950">{project.title}</h3>
                  <span className="font-mono text-xs text-gray-500">{project.category}</span>
                </div>
                <p className="mt-1.5 text-sm text-gray-800">
                  <strong>Problem:</strong> {project.problem}
                </p>
                <p className="mt-1 text-sm text-gray-800">
                  <strong>Contribution:</strong> {project.contribution}
                </p>
                {project.tech_stack.length > 0 && (
                  <p className="mt-1.5 font-mono text-xs text-gray-600">
                    Stack: {project.tech_stack.join(", ")}
                  </p>
                )}
                {(project.github_url || project.live_demo_url) && (
                  <p className="mt-1 text-xs text-gray-600">
                    {project.github_url ? `GitHub: ${project.github_url}` : ""}
                    {project.github_url && project.live_demo_url ? " | " : ""}
                    {project.live_demo_url ? `Demo: ${project.live_demo_url}` : ""}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
