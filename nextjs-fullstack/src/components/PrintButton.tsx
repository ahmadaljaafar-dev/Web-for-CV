"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-lg bg-electric px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-bright"
    >
      Print / Save as PDF
    </button>
  );
}
