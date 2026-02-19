import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLists } from "../../hooks/useLists";
import { useTheme } from "../../contexts/ThemeContext";

const ICON_SIZE = "w-5 h-5";

function NavIcon({ path, filled = false }) {
  const icons = {
    inbox: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
        />
      </svg>
    ),
    sun: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
    calendar: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
    check: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    list: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
    plus: (
      <svg
        className={ICON_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  };
  return icons[path] || null;
}

const navItems = [
  { to: "/inbox", label: "Inbox", icon: "inbox" },
  { to: "/my-day", label: "Meu Dia", icon: "sun" },
  { to: "/planned", label: "Planejado", icon: "calendar" },
  { to: "/completed", label: "Concluídas", icon: "check" },
];

export default function Sidebar({ onClose, onNewTask }) {
  const { user, logout } = useAuth();
  const { lists, createList, deleteList } = useLists();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);

  const handleCreateList = async (e) => {
    e.preventDefault();
    const name = newListName.trim();
    if (!name) return;
    try {
      const list = await createList({ name, color: "#3b82f6" });
      setNewListName("");
      setShowNewList(false);
      navigate(`/list/${list.id}`);
    } catch (err) {
      alert("Erro ao criar lista: " + err.message);
    }
  };

  const handleDeleteList = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Excluir esta lista e todas as tarefas dela?")) return;
    try {
      await deleteList(id);
      navigate("/inbox");
    } catch (err) {
      alert("Erro ao excluir lista");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          onClick={onClose}
          aria-label="Fechar sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={() => {
            onNewTask();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
          aria-label="Nova tarefa (n)"
        >
          <NavIcon path="plus" />
          <span>Nova Tarefa</span>
          <kbd className="ml-auto text-xs bg-primary-700 px-1.5 py-0.5 rounded opacity-75">
            N
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-0.5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
          Principal
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${
                 isActive
                   ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
                   : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
               }`
            }
          >
            <NavIcon path={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="mt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Minhas Listas
            </p>
            <button
              onClick={() => setShowNewList((v) => !v)}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              aria-label="Nova lista"
            >
              <NavIcon path="plus" />
            </button>
          </div>

          {showNewList && (
            <form onSubmit={handleCreateList} className="px-3 mb-2 flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nome da lista..."
                className="input text-sm py-1.5"
                autoFocus
                maxLength={60}
              />
              <button type="submit" className="btn-primary py-1.5 text-sm px-3">
                OK
              </button>
            </form>
          )}

          <div className="space-y-0.5">
            {lists.map((list) => (
              <NavLink
                key={list.id}
                to={`/list/${list.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                   ${
                     isActive
                       ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   }`
                }
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: list.color || "#3b82f6" }}
                />
                <span className="flex-1 truncate">
                  <NavIcon path="list" />
                  <span className="ml-0.5">{list.name}</span>
                </span>
                <button
                  onClick={(e) => handleDeleteList(e, list.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-opacity"
                  aria-label="Excluir lista"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </NavLink>
            ))}

            {lists.length === 0 && !showNewList && (
              <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 italic">
                Nenhuma lista criada ainda
              </p>
            )}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              Tema Claro
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              Tema Escuro
            </>
          )}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Sair
        </button>
      </div>
    </div>
  );
}
