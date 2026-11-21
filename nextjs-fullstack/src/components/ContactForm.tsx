"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || "Please check your details and try again.");
        return;
      }

      setStatus("success");
      setFeedback("Your message has been received. Ahmad will review it in his inbox.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error while sending your message. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-graphite-700/80 bg-graphite-900/70 p-6"
      noValidate
    >
      <div>
        <label htmlFor="contact-name" className="block font-mono text-xs text-warm-muted">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block font-mono text-xs text-warm-muted">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-mono text-xs text-warm-muted">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about the website, app, or workflow you want to build."
          className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white focus:border-electric focus:outline-none"
        />
      </div>

      {feedback && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {feedback}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-electric px-5 py-3 font-medium text-white transition hover:bg-electric-bright disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
