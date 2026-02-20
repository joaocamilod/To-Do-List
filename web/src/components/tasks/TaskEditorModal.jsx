import React, { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { useTaskContext } from "../../contexts/TaskContext";

const PRIORITIES = [
  { value: "none", label: "Nenhuma", color: "text-gray-400" },
  { value: "low", label: "Baixa", color: "text-green-500" },
  { value: "medium", label: "Média", color: "text-yellow-500" },
  { value: "high", label: "Alta", color: "text-red-500" },
];

export default function TaskEditorModal({ task, onClose, defaultListId }) {
  const {
    createTask,
    updateTask,
    lists,
    createTask: ctx_createTask,
  } = useTaskContext();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    listId: task?.listId || defaultListId || "",
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

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAddSubtask = (e) => {
    if (e?.preventDefault) e.preventDefault();
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
    e.preventDefault();
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
      } else {
        await createTask(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            aria-label="Fechar modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm animate-shake">
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="O que precisa ser feito?"
              className="input"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label
              htmlFor="task-desc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Adicionar notas ou detalhes..."
              className="input resize-none"
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Prioridade
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="input"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-list"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lista
              </label>
              <select
                id="task-list"
                value={form.listId}
                onChange={(e) => set("listId", e.target.value)}
                className="input"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-due"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Data limite
              </label>
              <input
                id="task-due"
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                className="input text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="task-reminder"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lembrete
              </label>
              <input
                id="task-reminder"
                type="datetime-local"
                value={form.reminder}
                onChange={(e) => set("reminder", e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.myDay}
                onChange={(e) => set("myDay", e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                ☀️ Meu Dia
              </span>
            </label>
            {isEdit && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.completed}
                  onChange={(e) => set("completed", e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  ✅ Concluída
                </span>
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Checklist
            </label>

            {subtasks.length > 0 && (
              <ul className="space-y-1.5 mb-2">
                {subtasks.map((sub) => (
                  <li key={sub.id} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => toggleSubtask(sub.id)}
                      className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                        ${
                          sub.completed
                            ? "bg-primary-600 border-primary-600"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-500"
                        }`}
                      aria-label={sub.completed ? "Desmarcar" : "Marcar"}
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
                    </button>
                    <span
                      className={`flex-1 text-sm ${sub.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(sub.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                      aria-label="Remover subtarefa"
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
                  </li>
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
                    handleAddSubtask(e);
                  }
                }}
                placeholder="Adicionar item ao checklist..."
                className="input text-sm py-1.5 flex-1"
                maxLength={200}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn-secondary text-sm py-1.5 px-3"
                disabled={!newSubtask.trim()}
              >
                + Adicionar
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
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
