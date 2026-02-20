import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SEARCH_FOCUS_EVENT } from "../../hooks/useKeyboardShortcuts";
import { useTaskContext } from "../../contexts/TaskContext";

const PAGE_META = {
  "/inbox": { title: "Inbox", emoji: "📥" },
  "/my-day": { title: "Meu Dia", emoji: "☀️" },
  "/planned": { title: "Planejado", emoji: "📅" },
  "/completed": { title: "Concluídas", emoji: "✅" },
};

export default function TopBar({ onMenuToggle, onNewTask, subtitle }) {
  const location = useLocation();
  const { fetchTasks } = useTaskContext();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const meta = PAGE_META[location.pathname];
  const title = meta?.title || "Minhas Tarefas";

  useEffect(() => {
    const handler = () => {
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener(SEARCH_FOCUS_EVENT, handler);
    return () => window.removeEventListener(SEARCH_FOCUS_EVENT, handler);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchTasks({ search: q || undefined });
  };

  const clearSearch = () => {
    setSearch("");
    fetchTasks({ search: undefined });
    searchRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-10 bg-surface border-b border-app">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="p-2 -ml-1 rounded-xl hover:bg-white/8 text-[var(--color-text-secondary)] transition-colors lg:hidden"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <h1 className="text-[15px] font-semibold text-[var(--color-text-primary)] flex-shrink-0 tracking-tight">
          {title}
        </h1>

        <div className="flex-1 max-w-sm relative ml-2">
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-150 ${searchFocused ? "text-primary-500" : "text-[var(--color-text-muted)]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar... (/)"
            className="input pl-9 pr-8 text-sm py-1.5"
            aria-label="Buscar tarefas"
          />
          {search && (
            <button
              onClick={clearSearch}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
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
          )}
        </div>

        <button
          onClick={onNewTask}
          className="hidden sm:flex btn-primary text-sm py-1.5 px-3 flex-shrink-0"
          aria-label="Nova tarefa (N)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Nova</span>
          <kbd className="text-[10px] bg-primary-700 px-1 py-0.5 rounded opacity-70 font-mono">
            N
          </kbd>
        </button>

        {subtitle && (
          <span className="hidden sm:block text-xs text-[var(--color-text-muted)] whitespace-nowrap flex-shrink-0 ml-auto">
            {subtitle}
          </span>
        )}
      </div>
    </header>
  );
}
