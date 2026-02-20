import React from "react";

const ILLUSTRATIONS = {
  tasks: (
    <svg
      className="w-12 h-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="6"
        width="32"
        height="36"
        rx="4"
        className="fill-[var(--color-border)]"
      />
      <rect
        x="14"
        y="14"
        width="20"
        height="2.5"
        rx="1.25"
        className="fill-[var(--color-text-muted)]"
      />
      <rect
        x="14"
        y="20"
        width="14"
        height="2.5"
        rx="1.25"
        className="fill-[var(--color-text-muted)]"
      />
      <rect
        x="14"
        y="26"
        width="17"
        height="2.5"
        rx="1.25"
        className="fill-[var(--color-text-muted)]"
      />
      <circle cx="36" cy="36" r="9" className="fill-primary-600" />
      <path
        d="M32.5 36l2.5 2.5L39.5 33"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  myday: (
    <svg
      className="w-12 h-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="10" className="fill-yellow-400/30" />
      <circle cx="24" cy="24" r="6" className="fill-yellow-400" />
      <line
        x1="24"
        y1="8"
        x2="24"
        y2="12"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="36"
        x2="24"
        y2="40"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="24"
        x2="12"
        y2="24"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="24"
        x2="40"
        y2="24"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12.69"
        y1="12.69"
        x2="15.52"
        y2="15.52"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="32.48"
        y1="32.48"
        x2="35.31"
        y2="35.31"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="35.31"
        y1="12.69"
        x2="32.48"
        y2="15.52"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="15.52"
        y1="32.48"
        x2="12.69"
        y2="35.31"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  completed: (
    <svg
      className="w-12 h-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="16" className="fill-green-500/15" />
      <circle cx="24" cy="24" r="10" className="fill-green-500/25" />
      <path
        d="M17 24l5 5 9-10"
        className="stroke-green-500"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  planned: (
    <svg
      className="w-12 h-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="12"
        width="32"
        height="28"
        rx="4"
        className="fill-[var(--color-border)]"
      />
      <rect
        x="8"
        y="12"
        width="32"
        height="10"
        rx="4"
        className="fill-primary-500/30"
      />
      <line
        x1="16"
        y1="8"
        x2="16"
        y2="16"
        className="stroke-[var(--color-text-secondary)]"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="8"
        x2="32"
        y2="16"
        className="stroke-[var(--color-text-secondary)]"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="14"
        y="26"
        width="6"
        height="6"
        rx="1.5"
        className="fill-primary-400/40"
      />
      <rect
        x="24"
        y="26"
        width="6"
        height="6"
        rx="1.5"
        className="fill-primary-400/40"
      />
    </svg>
  ),
  search: (
    <svg
      className="w-12 h-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="21" cy="21" r="12" className="fill-[var(--color-border)]" />
      <path
        d="M30 30l8 8"
        className="stroke-[var(--color-text-muted)]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 21h10M21 16v10"
        className="stroke-[var(--color-text-secondary)]"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function EmptyState({
  variant = "tasks",
  title,
  description,
  cta,
  onCta,
  hint,
}) {
  const icon = ILLUSTRATIONS[variant] || ILLUSTRATIONS.tasks;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none animate-fade-in">
      <div className="mb-5 opacity-80">{icon}</div>

      {title && (
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1.5">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {cta && onCta && (
        <button onClick={onCta} className="mt-5 btn-primary text-sm px-5 py-2">
          {cta}
        </button>
      )}

      {hint && (
        <p className="mt-4 text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {hint}
        </p>
      )}
    </div>
  );
}
