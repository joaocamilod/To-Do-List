import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { useTaskContext } from "../../contexts/TaskContext";
import { useToast } from "../../contexts/ToastContext";
import DateTimeInput from "../ui/DateTimeInput";

const PRIORITIES = [
  { value: "none", label: "Nenhuma", color: "text-[var(--color-text-muted)]" },
  { value: "low", label: "Baixa", color: "text-green-500" },
  { value: "medium", label: "Média", color: "text-yellow-500" },
  { value: "high", label: "Alta", color: "text-red-500" },
];

function ToggleCheck({ checked, onChange, label, id }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 cursor-pointer select-none group"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`
            w-9 h-5 rounded-full border-2 transition-all duration-[160ms] ease-smooth
            peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/50 peer-focus-visible:ring-offset-1
            ${
              checked
                ? "bg-primary-600 border-primary-600"
                : "bg-[var(--color-border)] border-[var(--color-border)]"
            }
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
            transition-transform duration-[160ms] ease-smooth
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </div>
      <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
    </label>
  );
}

function SubtaskItem({ sub, onToggle, onRemove }) {
  return (
    <li className="flex items-center gap-2.5 group py-0.5">
      <button
        type="button"
        role="checkbox"
        aria-checked={sub.completed}
        onClick={() => onToggle(sub.id)}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center -ml-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500/50"
        aria-label={sub.completed ? "Desmarcar subtarefa" : "Marcar subtarefa"}
      >
        <span
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-[160ms]
            ${
              sub.completed
                ? "bg-primary-600 border-primary-600"
                : "border-[var(--color-text-muted)] hover:border-primary-500"
            }`}
        >
          {sub.completed && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
        </span>
      </button>
      <span
        className={`flex-1 text-sm leading-snug ${sub.completed ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}
      >
        {sub.title}
      </span>
      <button
        type="button"
        onClick={() => onRemove(sub.id)}
        aria-label="Remover subtarefa"
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-1.5 rounded-lg hover:bg-red-500/12 text-[var(--color-text-muted)] hover:text-red-500 transition-all"
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
    </li>
  );
}

export default function TaskEditorModal({ task, onClose, defaultListId }) {
  const { createTask, updateTask, lists } = useTaskContext();
  const { addToast } = useToast();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    listId: task?.listId ?? defaultListId ?? "",
    dueDate: task?.dueDate
      ? format(parseISO(task.dueDate), "yyyy-MM-dd'T'HH:mm")
      : "",
    reminder: task?.reminder
      ? format(parseISO(task.reminder), "yyyy-MM-dd'T'HH:mm")
      : "",
    priority: task?.priority || "none",
    myDay: task?.myDay || false,
    completed: task?.completed || false,
  });

  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const titleRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);

  const set = useCallback(
    (key, value) => setForm((f) => ({ ...f, [key]: value })),
    [],
  );

  const handleAddSubtask = (e) => {
    e?.preventDefault();
    const title = newSubtask.trim();
    if (!title) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), title, completed: false },
    ]);
    setNewSubtask("");
  };

  const toggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

  const removeSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      setError("O título é obrigatório");
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate ? `${form.dueDate}:00` : null,
        reminder: form.reminder ? `${form.reminder}:00` : null,
        listId: form.listId || null,
        checklist: subtasks.map((s) => ({
          title: s.title,
          completed: s.completed,
        })),
      };
      if (isEdit) {
        await updateTask(task.id, payload);
        addToast({ message: "Tarefa atualizada!", type: "success" });
      } else {
        await createTask(payload);
        addToast({ message: "Tarefa criada!", type: "success" });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const priorityOption = PRIORITIES.find((p) => p.value === form.priority);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-2xl bg-surface rounded-t-3xl sm:rounded-2xl shadow-modal animate-scale-in max-h-[95dvh] sm:max-h-[90dvh] flex flex-col border border-app">
        <div className="flex items-center justify-between px-6 py-4 border-b border-app flex-shrink-0">
          <h2
            id="modal-title"
            className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight"
          >
            {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/8 text-[var(--color-text-muted)] transition-colors"
            aria-label="Fechar modal (Esc)"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          id="task-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-sm animate-shake"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5"
            >
              Título{" "}
              <span className="text-red-500 normal-case tracking-normal font-normal">
                *
              </span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="O que precisa ser feito?"
              className="input text-base font-medium"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label
              htmlFor="task-desc"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5"
            >
              Notas
            </label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Adicionar notas ou detalhes..."
              className="input resize-none text-sm"
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5"
              >
                Prioridade
              </label>
              <div className="relative">
                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(e) => set("priority", e.target.value)}
                  className="input text-sm appearance-none pr-8"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none ${priorityOption?.color}`}
                  aria-hidden="true"
                >
                  ●
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="task-list"
                className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5"
              >
                Lista
              </label>
              <select
                id="task-list"
                value={form.listId}
                onChange={(e) => set("listId", e.target.value)}
                className="input text-sm"
              >
                <option value="">Inbox</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateTimeInput
              id="task-due"
              label="Data limite"
              value={form.dueDate}
              onChange={(v) => set("dueDate", v)}
            />
            <DateTimeInput
              id="task-reminder"
              label="Lembrete"
              value={form.reminder}
              onChange={(v) => set("reminder", v)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 py-1">
            <ToggleCheck
              id="toggle-myday"
              checked={form.myDay}
              onChange={(v) => set("myDay", v)}
              label="☀️ Meu Dia"
            />
            {isEdit && (
              <ToggleCheck
                id="toggle-completed"
                checked={form.completed}
                onChange={(v) => set("completed", v)}
                label="✅ Concluída"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Checklist{" "}
              {subtasks.length > 0 &&
                `(${subtasks.filter((s) => s.completed).length}/${subtasks.length})`}
            </label>

            {subtasks.length > 0 && (
              <ul className="space-y-0.5 mb-3 border border-app rounded-xl px-3 py-1.5">
                {subtasks.map((sub) => (
                  <SubtaskItem
                    key={sub.id}
                    sub={sub}
                    onToggle={toggleSubtask}
                    onRemove={removeSubtask}
                  />
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Adicionar item..."
                className="input text-sm py-1.5 flex-1"
                maxLength={200}
                aria-label="Novo item de checklist"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn-secondary text-sm py-1.5 px-3 whitespace-nowrap"
                disabled={!newSubtask.trim()}
              >
                + Adicionar
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-app flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            form="task-form"
            type="submit"
            onClick={handleSubmit}
            className="btn-primary min-w-[96px]"
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Salvando...
              </span>
            ) : isEdit ? (
              "Salvar"
            ) : (
              "Criar Tarefa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
