import Link from "next/link";
import dynamic from "next/dynamic";
import { getProfile, getPublishedProjects } from "@/lib/data";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AutomationDemo } from "@/components/AutomationDemo";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

const StackScene3D = dynamic(
  () => import("@/components/StackScene3D").then((m) => m.StackScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-graphite-700/80 bg-graphite-900/70 font-mono text-xs text-warm-muted">
        Initializing 3D stack...
      </div>
    ),
  }
);

export default async function HomePage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
  ]);

  return (
    <div className="min-h-screen bg-graphite-950 text-warm-white">
      <header className="sticky top-0 z-40 border-b border-graphite-700/70 bg-graphite-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#top" className="font-mono text-sm font-semibold tracking-tight text-warm-white">
            {profile.full_name}
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-warm-muted md:flex">
            <a href="#about" className="hover:text-warm-white">About</a>
            <a href="#skills" className="hover:text-warm-white">Skills</a>
            <a href="#projects" className="hover:text-warm-white">Projects</a>
            <a href="#automation-demo" className="hover:text-warm-white">Demo</a>
            <a href="#contact" className="hover:text-warm-white">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/cv"
              className="rounded-lg border border-graphite-600 px-3 py-1.5 font-mono text-xs text-warm-white transition hover:border-electric"
            >
              Print / Save CV
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-graphite-700 bg-graphite-900 px-3 py-1.5 font-mono text-xs text-warm-muted transition hover:text-warm-white"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 1. Hero */}
        <section className="grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
              {profile.professional_title}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-warm-white sm:text-5xl">
              {profile.full_name}
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-warm-muted sm:text-2xl">
              {profile.hero_headline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-lg bg-electric px-5 py-3 text-sm font-medium text-white transition hover:bg-electric-bright"
              >
                Explore my work
              </a>
              <a
                href="#contact"
                className="rounded-lg border border-graphite-600 bg-graphite-900 px-5 py-3 text-sm font-medium text-warm-white transition hover:border-electric"
              >
                Contact me
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <StackScene3D />
          </div>
        </section>

        {/* 2. About */}
        <section id="about" className="scroll-mt-24 border-t border-graphite-800 py-20">
          <div className="grid items-start gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
                01 · About
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-white">
                Turning ideas into working software
              </h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-electric/35 bg-graphite-900 shadow-2xl">
                <img
                  src="/images/ahmad-portrait.jpg"
                  alt={profile.full_name}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-8 md:pt-8">
              <p className="text-base leading-relaxed text-warm-muted sm:text-lg">
                {profile.about_text}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Skills */}
        <section id="skills" className="scroll-mt-24 border-t border-graphite-800 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
            02 · Capabilities
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-white">
            Skills
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {profile.skills_json.map((item) => (
              <div
                key={item.group}
                className="rounded-2xl border border-graphite-700/80 bg-graphite-900/70 p-6"
              >
                <h3 className="text-lg font-semibold text-warm-white">{item.group}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warm-muted">
                  {item.description}
                </p>
                {item.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-graphite-700 bg-graphite-950 px-2.5 py-1 font-mono text-[11px] text-electric-bright"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. Projects */}
        <div className="border-t border-graphite-800">
          <ProjectsSection projects={projects} />
        </div>

        {/* 5. Interactive Automation Demo */}
        <div className="border-t border-graphite-800">
          <AutomationDemo />
        </div>

        {/* 6. Contact */}
        <section id="contact" className="scroll-mt-24 border-t border-graphite-800 py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
                05 · Contact
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-white">
                Let&apos;s work together
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-warm-muted">
                Reach out directly by email or phone, or send a project inquiry using the form.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="block rounded-xl border border-graphite-700 bg-graphite-900/70 p-4 transition hover:border-electric"
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider text-warm-muted">
                    Email
                  </div>
                  <div className="mt-1 font-medium text-warm-white">{profile.email}</div>
                </a>
                <a
                  href={`tel:${profile.phone}`}
                  className="block rounded-xl border border-graphite-700 bg-graphite-900/70 p-4 transition hover:border-electric"
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider text-warm-muted">
                    Phone
                  </div>
                  <div className="mt-1 font-medium text-warm-white">{profile.phone}</div>
                </a>
                <a
                  href={`https://wa.me/961${profile.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-graphite-700 bg-graphite-900/70 p-4 transition hover:border-electric"
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider text-warm-muted">
                    WhatsApp
                  </div>
                  <div className="mt-1 font-medium text-warm-white">{profile.phone}</div>
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-graphite-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-warm-muted sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} {profile.full_name}</span>
          <div className="flex items-center gap-4 font-mono">
            <Link href="/cv" className="hover:text-warm-white">Print / Save CV</Link>
            <Link href="/admin" className="hover:text-warm-white">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
