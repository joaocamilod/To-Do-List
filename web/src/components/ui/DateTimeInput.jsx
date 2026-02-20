import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DateTimeInput({
  id,
  label,
  value,
  onChange,
  required = false,
  helperText = "Ex.: 20/02/2026 · 11:47",
}) {
  const [focused, setFocused] = useState(false);

  const datePart = value ? value.split("T")[0] : "";
  const timePart = value ? (value.split("T")[1] ?? "") : "";
  const hasValue = Boolean(datePart);

  const combine = (d, t) => {
    if (!d) return "";
    return `${d}T${t || "00:00"}`;
  };

  const handleDateChange = (e) => onChange(combine(e.target.value, timePart));
  const handleTimeChange = (e) => {
    if (!datePart) return;
    onChange(combine(datePart, e.target.value));
  };
  const handleClear = () => onChange("");

  let preview = "";
  if (datePart) {
    try {
      const d = parseISO(datePart);
      if (isValid(d)) {
        preview = format(d, "dd 'de' MMM 'de' yyyy", { locale: ptBR });
        if (timePart) preview += ` · ${timePart}`;
      }
    } catch {}
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={`${id}-date`}
        className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1 normal-case tracking-normal font-normal">
            *
          </span>
        )}
      </label>

      <div
        className={`
          flex items-stretch rounded-xl border bg-[var(--color-card)]
          transition-all duration-[160ms] ease-smooth
          ${
            focused
              ? "border-primary-500 ring-2 ring-primary-500/20"
              : "border-[var(--color-border)] hover:border-gray-400 dark:hover:border-gray-600"
          }
        `}
      >
        <div className="flex items-center flex-1 min-w-0 px-3 py-2.5 gap-2">
          <svg
            className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${hasValue ? "text-primary-500" : "text-[var(--color-text-muted)]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <input
            id={`${id}-date`}
            type="date"
            value={datePart}
            onChange={handleDateChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label={`Data — ${label}`}
            className="
              flex-1 min-w-0 bg-transparent text-sm
              text-[var(--color-text-primary)]
              outline-none cursor-pointer
              [color-scheme:light] dark:[color-scheme:dark]
            "
          />
        </div>

        <div
          className="w-px bg-[var(--color-border)] self-stretch flex-shrink-0"
          aria-hidden="true"
        />

        <div className="flex items-center px-3 py-2.5 gap-2">
          <svg
            className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${timePart && datePart ? "text-primary-500" : datePart ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)] opacity-30"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <input
            id={`${id}-time`}
            type="time"
            value={timePart}
            onChange={handleTimeChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={!datePart}
            aria-label={`Horário — ${label}`}
            aria-disabled={!datePart}
            className="
              w-[4.5rem] bg-transparent text-sm
              text-[var(--color-text-primary)]
              outline-none cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed
              [color-scheme:light] dark:[color-scheme:dark]
            "
          />
        </div>

        {hasValue && (
          <>
            <div
              className="w-px bg-[var(--color-border)] self-stretch flex-shrink-0"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={handleClear}
              aria-label={`Limpar ${label}`}
              className="
                flex items-center justify-center px-3
                text-[var(--color-text-muted)] hover:text-red-500
                hover:bg-red-500/10 rounded-r-xl
                transition-colors duration-[160ms]
              "
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {preview ? (
        <p className="text-xs text-primary-500 dark:text-primary-400 pl-1 flex items-center gap-1.5 animate-fade-in">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          {preview}
        </p>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)] pl-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
