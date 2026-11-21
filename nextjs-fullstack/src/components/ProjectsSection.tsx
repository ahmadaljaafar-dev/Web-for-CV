"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/types/portfolio";

const CATEGORIES: Array<"All" | ProjectCategory> = [
  "All",
  "Software Engineering",
  "Web Development",
  "App Development",
  "n8n Automation",
];

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<"All" | ProjectCategory>("All");

  const visibleProjects = useMemo(() => {
    if (selected === "All") return projects;
    return projects.filter((p) => p.category === selected);
  }, [projects, selected]);

  return (
    <section id="projects" className="scroll-mt-24 py-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
            03 · Published Work
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-white">
            Projects
          </h2>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((category) => {
            const active = selected === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(category)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
                  active
                    ? "bg-electric text-white"
                    : "border border-graphite-700 bg-graphite-900 text-warm-muted hover:border-electric/50 hover:text-warm-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <div className="rounded-2xl border border-graphite-700 bg-graphite-900/60 p-10 text-center text-warm-muted">
          No published projects in this category yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-graphite-700/80 bg-graphite-900/70 transition hover:border-electric/50"
            >
              <div className="relative flex aspect-[16/9] w-full items-center justify-center border-b border-graphite-700/70 bg-graphite-950">
                {project.screenshot_url ? (
                  <img
                    src={project.screenshot_url}
                    alt={`${project.title} screenshot`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-electric-glow">
                      {project.category}
                    </span>
                    <span className="text-xs text-warm-muted">
                      Screenshot slot — upload via Admin
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-electric-bright">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-warm-white">
                  {project.title}
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-warm-muted">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-warm-white/80">
                      Problem
                    </p>
                    <p className="mt-1">{project.problem}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-warm-white/80">
                      My Contribution
                    </p>
                    <p className="mt-1">{project.contribution}</p>
                  </div>
                </div>

                {project.tech_stack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-graphite-700 bg-graphite-950 px-2.5 py-1 font-mono text-[11px] text-warm-white/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {(project.github_url || project.live_demo_url) && (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-graphite-700/70 pt-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-graphite-600 px-3.5 py-2 font-mono text-xs text-warm-white transition hover:border-electric hover:text-electric-bright"
                      >
                        GitHub Repo ↗
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-electric px-3.5 py-2 font-mono text-xs text-white transition hover:bg-electric-bright"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
