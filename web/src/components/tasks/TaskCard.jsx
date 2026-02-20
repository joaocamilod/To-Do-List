import React, { useState } from "react";
import { format, isPast, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskContext } from "../../contexts/TaskContext";
import { useToast } from "../../contexts/ToastContext";

const PRIORITY = {
  high: { label: "Alta", badgeClass: "badge-priority-high", dot: "bg-red-500" },
  medium: {
    label: "Média",
    badgeClass: "badge-priority-medium",
    dot: "bg-yellow-400",
  },
  low: {
    label: "Baixa",
    badgeClass: "badge-priority-low",
    dot: "bg-green-500",
  },
  none: null,
};

function DateBadge({ dueDate, completed }) {
  if (!dueDate) return null;

  const date = parseISO(dueDate);
  const overdue = !completed && isPast(date) && !isToday(date);
  const todayDue = !completed && isToday(date);

  const label = format(date, "dd MMM", { locale: ptBR });

  if (overdue) {
    return (
      <span
        className="badge-overdue"
        title={`Prazo: ${format(date, "PPp", { locale: ptBR })}`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"
          />
        </svg>
        {label} · Atrasada
      </span>
    );
  }

  return (
    <span
      className={`badge ${todayDue ? "bg-primary-500/12 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400" : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"}`}
      title={`Prazo: ${format(date, "PPp", { locale: ptBR })}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"
        />
      </svg>
      {label}
    </span>
  );
}

export default function TaskCard({ task, onClick }) {
  const { toggleComplete } = useTaskContext();
  const { addToast } = useToast();
  const [toggling, setToggling] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      await toggleComplete(task.id);
      if (!task.completed) {
        addToast({
          message: "Tarefa concluída!",
          type: "success",
          duration: 4500,
          action: {
            label: "Desfazer",
            onClick: () => toggleComplete(task.id),
          },
        });
      }
    } finally {
      setToggling(false);
    }
  };

  const priority = PRIORITY[task.priority || "none"];
  const completedSubs = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubs = (task.subtasks || []).length;
  const subtaskPct =
    totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        task-card group
        ${task.completed ? "opacity-55" : ""}
        ${isDragging ? "shadow-modal ring-2 ring-primary-400/50 !translate-y-0" : ""}
      `}
      onClick={() => onClick?.(task)}
      role="button"
      tabIndex={0}
      aria-label={`Tarefa: ${task.title}${task.completed ? " (concluída)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(task);
        }
      }}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 focus-visible:opacity-100"
          aria-label="Arrastar tarefa"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm-8 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        <button
          role="checkbox"
          aria-checked={task.completed}
          aria-label={
            task.completed ? "Marcar como incompleta" : "Marcar como concluída"
          }
          onClick={handleToggle}
          disabled={toggling}
          className={`
            flex-shrink-0 -mt-0.5 -ml-1
            w-10 h-10 flex items-center justify-center rounded-full
            transition-all duration-[160ms] ease-smooth
            focus-visible:ring-2 focus-visible:ring-primary-500/50
            ${toggling ? "animate-check-pop" : ""}
          `}
        >
          <span
            className={`
              w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
              transition-all duration-[160ms] ease-smooth
              ${
                task.completed
                  ? "bg-primary-600 border-primary-600 shadow-sm"
                  : "border-[var(--color-text-muted)] hover:border-primary-500"
              }
            `}
          >
            {task.completed && (
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

        <div className="flex-1 min-w-0 py-0.5">
          <p
            className={`text-sm font-medium leading-snug truncate ${
              task.completed
                ? "line-through text-[var(--color-text-muted)]"
                : "text-[var(--color-text-primary)]"
            }`}
            title={task.title}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              className="mt-0.5 text-xs text-[var(--color-text-secondary)] line-clamp-1"
              title={task.description}
            >
              {task.description}
            </p>
          )}

          {totalSubs > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskPct}%` }}
                />
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)] tabular-nums flex-shrink-0">
                {completedSubs}/{totalSubs}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {priority && (
              <span className={priority.badgeClass}>
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
            )}

            <DateBadge dueDate={task.dueDate} completed={task.completed} />

            {task.myDay && (
              <span className="badge-myday">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
                Meu Dia
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
