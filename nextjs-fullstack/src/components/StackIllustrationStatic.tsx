"use client";

export function StackIllustrationStatic() {
  return (
    <div
      className="relative flex w-full items-center justify-center rounded-2xl border border-graphite-700/80 bg-graphite-900/70 p-6"
      role="img"
      aria-label="Three-layer full-stack architecture illustration: User Interface, API, and Database connected by a light pulse"
    >
      <svg viewBox="0 0 360 320" className="h-auto w-full max-w-[340px]" fill="none">
        <defs>
          <linearGradient id="pulseLine" x1="180" y1="74" x2="180" y2="246" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Vertical request signal conduit */}
        <line x1="180" y1="72" x2="180" y2="248" stroke="url(#pulseLine)" strokeWidth="2.5" strokeDasharray="4 4" />
        <circle cx="180" cy="118" r="5" fill="#38BDF8" />
        <circle cx="180" cy="202" r="5" fill="#60A5FA" />

        {/* Layer 1: UI */}
        <g transform="translate(30, 26)">
          <polygon points="150,0 288,32 150,64 12,32" fill="#181C26" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="150" y="29" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace" letterSpacing="1.6">
            LAYER 01
          </text>
          <text x="150" y="45" textAnchor="middle" fill="#F4F1EA" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            User Interface
          </text>
        </g>

        {/* Layer 2: API */}
        <g transform="translate(30, 126)">
          <polygon points="150,0 288,32 150,64 12,32" fill="#181C26" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="150" y="29" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace" letterSpacing="1.6">
            LAYER 02
          </text>
          <text x="150" y="45" textAnchor="middle" fill="#F4F1EA" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            API &amp; Automation
          </text>
        </g>

        {/* Layer 3: Database */}
        <g transform="translate(30, 226)">
          <polygon points="150,0 288,32 150,64 12,32" fill="#181C26" stroke="#60A5FA" strokeWidth="1.5" />
          <text x="150" y="29" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace" letterSpacing="1.6">
            LAYER 03
          </text>
          <text x="150" y="45" textAnchor="middle" fill="#F4F1EA" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            PostgreSQL Database
          </text>
        </g>
      </svg>
    </div>
  );
}
