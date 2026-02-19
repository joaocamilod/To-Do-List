import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SEARCH_FOCUS_EVENT } from "../../hooks/useKeyboardShortcuts";
import { useTaskContext } from "../../contexts/TaskContext";

const PAGE_TITLES = {
  "/inbox": "Inbox",
  "/my-day": "Meu Dia",
  "/planned": "Planejado",
  "/completed": "Concluídas",
};

export default function TopBar({ onMenuToggle, onNewTask }) {
  const location = useLocation();
  const { fetchTasks } = useTaskContext();
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const title = PAGE_TITLES[location.pathname] || "Minhas Tarefas";

  useEffect(() => {
    const handler = () => searchRef.current?.focus();
    window.addEventListener(SEARCH_FOCUS_EVENT, handler);
    return () => window.removeEventListener(SEARCH_FOCUS_EVENT, handler);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchTasks({ search: q || undefined });
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
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

        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-shrink-0">
          {title}
        </h1>

        <div className="flex-1 max-w-md relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="Buscar tarefas... (/)"
            className="input pl-9 text-sm py-2"
            aria-label="Buscar tarefas"
          />
        </div>

        <button
          onClick={onNewTask}
          className="hidden sm:flex items-center gap-1.5 btn-primary text-sm py-2"
          aria-label="Nova tarefa (n)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Nova</span>
          <kbd className="text-xs bg-primary-700 px-1 py-0.5 rounded opacity-75">
            N
          </kbd>
        </button>
      </div>
    </header>
  );
}
