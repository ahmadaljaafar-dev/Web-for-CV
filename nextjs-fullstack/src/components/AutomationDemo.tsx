"use client";

import { useState } from "react";

type StepLog = {
  id: string;
  label: string;
  layer: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
};

export function AutomationDemo() {
  const [name, setName] = useState("Layla Hassan");
  const [email, setEmail] = useState("layla@example.com");
  const [summary, setSummary] = useState(
    "Need a web dashboard and n8n workflow to route customer onboarding forms into our task tracker."
  );
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<StepLog[]>([]);
  const [running, setRunning] = useState(false);

  const runDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (running) return;
    setRunning(true);
    setLogs([]);
    setActiveStep(0);

    const trimmedName = name.trim() || "Visitor";
    const trimmedEmail = email.trim() || "visitor@example.com";
    const trimmedSummary = summary.trim() || "Sample automation request";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const taskId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;

    const steps: StepLog[] = [
      {
        id: "submit",
        label: "Form submission",
        layer: "UI Layer",
        input: { name: trimmedName, email: trimmedEmail, projectSummary: trimmedSummary },
        output: { status: "received", source: "local_simulation", timestamp: new Date().toISOString() },
      },
      {
        id: "validate",
        label: "Validate details",
        layer: "API Layer",
        input: { email: trimmedEmail, summaryLength: trimmedSummary.length },
        output: {
          valid: emailValid && trimmedSummary.length >= 10,
          checks: {
            emailFormat: emailValid ? "pass" : "needs_attention",
            summaryProvided: trimmedSummary.length >= 10 ? "pass" : "short",
          },
        },
      },
      {
        id: "task",
        label: "Create task",
        layer: "Database Layer",
        input: { title: `Inquiry: ${trimmedName}`, category: "Automation & Web", priority: "normal" },
        output: { taskId, persisted: false, note: "Simulated locally — nothing written to database" },
      },
      {
        id: "notify",
        label: "Notify team",
        layer: "n8n Workflow",
        input: { channel: "#project-intake", taskId, requester: trimmedName },
        output: { delivered: true, mode: "local_simulation", externalMessagesSent: 0 },
      },
    ];

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delayMs = reducedMotion ? 80 : 650;

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      setLogs((prev) => [...prev, steps[i]]);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    setRunning(false);
  };

  return (
    <section id="automation-demo" className="scroll-mt-24 py-20">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-glow">
          04 · Local Simulation
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-white">
          Interactive Automation Demo
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-warm-muted">
          Enter a sample project inquiry and watch a simulated request move through UI, API,
          Database, and n8n notification steps. Runs entirely in your browser—no messages are
          sent and no visitor data is stored.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <form
          onSubmit={runDemo}
          className="space-y-4 rounded-2xl border border-graphite-700/80 bg-graphite-900/70 p-6 lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-3 py-1 font-mono text-[11px] text-electric-bright">
            Simulation Only · No Data Stored
          </div>

          <div>
            <label htmlFor="demo-name" className="block font-mono text-xs text-warm-muted">
              Sample Name
            </label>
            <input
              id="demo-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="demo-email" className="block font-mono text-xs text-warm-muted">
              Sample Email
            </label>
            <input
              id="demo-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="demo-summary" className="block font-mono text-xs text-warm-muted">
              Sample Project Inquiry
            </label>
            <textarea
              id="demo-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={running}
            className="w-full rounded-lg bg-electric px-4 py-2.5 font-medium text-white transition hover:bg-electric-bright disabled:opacity-60"
          >
            {running ? "Running simulation..." : "Run demo"}
          </button>
        </form>

        <div className="rounded-2xl border border-graphite-700/80 bg-graphite-900/70 p-6 lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Form submission", "Validate details", "Create task", "Notify team"].map(
              (label, idx) => {
                const done = idx < logs.length;
                const current = idx === activeStep && running;
                return (
                  <div
                    key={label}
                    className={`rounded-xl border p-3 transition ${
                      current
                        ? "border-electric-glow bg-electric/15"
                        : done
                        ? "border-electric/50 bg-graphite-950"
                        : "border-graphite-700 bg-graphite-950/60"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-electric-glow">
                      Step 0{idx + 1}
                    </div>
                    <div className="mt-1 text-xs font-medium text-warm-white">{label}</div>
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-6 space-y-3">
            {logs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-graphite-700 p-8 text-center font-mono text-xs text-warm-muted">
                Click &ldquo;Run demo&rdquo; to inspect input and output payloads at each step.
              </div>
            ) : (
              logs.map((step, i) => (
                <div
                  key={step.id}
                  className="rounded-xl border border-graphite-700 bg-graphite-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-warm-white">
                      0{i + 1}. {step.label}
                    </span>
                    <span className="font-mono text-[11px] text-electric-glow">{step.layer}</span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-warm-muted">Input</div>
                      <pre className="mt-1 overflow-x-auto rounded bg-graphite-900 p-2 font-mono text-[11px] text-warm-white/90">
                        {JSON.stringify(step.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase text-warm-muted">Output</div>
                      <pre className="mt-1 overflow-x-auto rounded bg-graphite-900 p-2 font-mono text-[11px] text-electric-bright">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
