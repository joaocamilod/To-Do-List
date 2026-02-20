import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLists } from "../../hooks/useLists";
import { useTheme } from "../../contexts/ThemeContext";

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    inbox:
      "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z",
    sun: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
    calendar:
      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
    check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    list: "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    plus: "M12 4.5v15m7.5-7.5h-15",
    close: "M6 18L18 6M6 6l12 12",
    moon: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
    logout:
      "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
    chevronLeft: "M15.75 19.5L8.25 12l7.5-7.5",
    chevronRight: "M8.25 4.5l7.5 7.5-7.5 7.5",
    drag: null,
  };

  if (name === "drag") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm-8 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: "/inbox", label: "Inbox", icon: "inbox", color: "text-blue-500" },
  { to: "/my-day", label: "Meu Dia", icon: "sun", color: "text-yellow-500" },
  {
    to: "/planned",
    label: "Planejado",
    icon: "calendar",
    color: "text-purple-500",
  },
  {
    to: "/completed",
    label: "Concluídas",
    icon: "check",
    color: "text-green-500",
  },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  onClose,
  onNewTask,
}) {
  const { user, logout } = useAuth();
  const { lists, createList, deleteList } = useLists();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showNewList) inputRef.current?.focus();
  }, [showNewList]);

  const handleCreateList = async (e) => {
    e?.preventDefault();
    const name = newListName.trim();
    if (!name) return;
    setCreatingList(true);
    try {
      const list = await createList({ name, color: "#2563eb" });
      setNewListName("");
      setShowNewList(false);
      navigate(`/list/${list.id}`);
    } catch (err) {
      alert("Erro ao criar lista: " + err.message);
    } finally {
      setCreatingList(false);
    }
  };

  const handleDeleteList = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Excluir esta lista e todas as tarefas dela?")) return;
    try {
      await deleteList(id);
      navigate("/inbox");
    } catch {
      alert("Erro ao excluir lista");
    }
  };

  const handleNewTaskClick = () => {
    onNewTask();
    onClose();
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex flex-col h-full bg-surface border-r border-app shadow-sidebar overflow-hidden">
      <div
        className={`flex items-center border-b border-app transition-all duration-[220ms] ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
      >
        <div
          className="w-9 h-9 bg-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm"
          aria-hidden="true"
        >
          {avatarLetter}
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0 sidebar-user-info">
            <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate leading-tight">
              {user?.email}
            </p>
          </div>
        )}

        {!collapsed && (
          <button
            className="p-1.5 rounded-lg hover:bg-white/8 text-[var(--color-text-muted)] transition-colors lg:hidden"
            onClick={onClose}
            aria-label="Fechar sidebar"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        )}

        <button
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/8 text-[var(--color-text-muted)] transition-colors"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          <Icon
            name={collapsed ? "chevronRight" : "chevronLeft"}
            className="w-4 h-4"
          />
        </button>
      </div>

      <div className={`px-3 py-2 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={handleNewTaskClick}
          className={`
            flex items-center gap-2.5 rounded-xl font-semibold text-sm
            bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white
            shadow-sm transition-all duration-[160ms] ease-smooth
            focus-visible:ring-2 focus-visible:ring-primary-400
            ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2.5"}
          `}
          aria-label="Nova tarefa (N)"
        >
          <Icon name="plus" className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="sidebar-label">Nova Tarefa</span>
              <kbd className="sidebar-kbd ml-auto text-[10px] bg-primary-700 px-1.5 py-0.5 rounded opacity-70 font-mono">
                N
              </kbd>
            </>
          )}
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1"
        aria-label="Navegação principal"
      >
        <div className="space-y-0.5">
          {!collapsed && (
            <p className="sidebar-section-title text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] px-3 pt-2 pb-1 select-none">
              Principal
            </p>
          )}

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : ""} ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex-shrink-0 ${isActive ? "text-primary-500 dark:text-primary-400" : item.color} opacity-90`}
                  >
                    <Icon name={item.icon} className="w-[18px] h-[18px]" />
                  </span>
                  {!collapsed && (
                    <span className="sidebar-label flex-1 truncate">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="my-4 border-t border-[var(--color-border)]" />

        <div className="space-y-0.5">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-1">
              <p className="sidebar-section-title text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] select-none">
                Minhas Listas
              </p>
              <button
                onClick={() => setShowNewList((v) => !v)}
                className="p-1 rounded-lg hover:bg-white/8 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Nova lista"
                aria-expanded={showNewList}
              >
                <Icon name="plus" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {showNewList && !collapsed && (
            <form
              onSubmit={handleCreateList}
              className="px-2 mb-2 animate-slide-up"
            >
              <div className="flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setShowNewList(false);
                  }}
                  placeholder="Nome da lista..."
                  className="input text-xs py-1.5 flex-1"
                  maxLength={60}
                  aria-label="Nome da nova lista"
                />
                <button
                  type="submit"
                  className="btn-primary text-xs py-1.5 px-2.5"
                  disabled={!newListName.trim() || creatingList}
                >
                  {creatingList ? "…" : "OK"}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-0.5">
            {lists.map((list) => (
              <NavLink
                key={list.id}
                to={`/list/${list.id}`}
                onClick={onClose}
                title={collapsed ? list.name : undefined}
                className={({ isActive }) =>
                  `sidebar-item group ${isActive ? "sidebar-item-active" : ""} ${collapsed ? "justify-center" : ""}`
                }
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: list.color || "#2563eb" }}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <>
                    <span className="sidebar-label flex-1 truncate">
                      {list.name}
                    </span>
                    <button
                      onClick={(e) => handleDeleteList(e, list.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/15 text-red-400 transition-all"
                      aria-label={`Excluir lista ${list.name}`}
                    >
                      <Icon name="close" className="w-3 h-3" />
                    </button>
                  </>
                )}
              </NavLink>
            ))}

            {lists.length === 0 && !showNewList && !collapsed && (
              <p className="px-3 py-2 text-xs text-[var(--color-text-muted)] italic">
                Nenhuma lista ainda
              </p>
            )}
          </div>
        </div>
      </nav>

      <div className="p-2 border-t border-app space-y-0.5">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Tema Claro" : "Tema Escuro"}
          className={`sidebar-item w-full ${collapsed ? "justify-center" : ""}`}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <Icon
              name="sun"
              className="w-[18px] h-[18px] flex-shrink-0 text-yellow-400"
            />
          ) : (
            <Icon
              name="moon"
              className="w-[18px] h-[18px] flex-shrink-0 text-[var(--color-text-secondary)]"
            />
          )}
          {!collapsed && (
            <span className="sidebar-label text-sm">
              {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          title="Sair"
          className={`sidebar-item w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 ${collapsed ? "justify-center" : ""}`}
          aria-label="Sair da conta"
        >
          <Icon name="logout" className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="sidebar-label text-sm">Sair</span>}
        </button>
      </div>
    </div>
  );
}
