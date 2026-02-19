import React, { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskContext } from "../../contexts/TaskContext";

const PRIORITY_CONFIG = {
  high: {
    label: "Alta",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  medium: {
    label: "Média",
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  low: {
    label: "Baixa",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  none: { label: "", color: "text-gray-400", bg: "" },
};

export default function TaskCard({ task, onClick }) {
  const { toggleComplete } = useTaskContext();
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
    opacity: isDragging ? 0.4 : 1,
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      await toggleComplete(task.id);
    } finally {
      setToggling(false);
    }
  };

  const priority = PRIORITY_CONFIG[task.priority || "none"];
  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDate && !task.completed && isPast(dueDate);
  const completedSubs = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubs = (task.subtasks || []).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card group select-none ${task.completed ? "opacity-60" : ""} ${isDragging ? "shadow-lg ring-2 ring-primary-400" : ""}`}
      onClick={() => onClick?.(task)}
      role="button"
      tabIndex={0}
      aria-label={`Tarefa: ${task.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(task);
      }}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label="Arrastar tarefa"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm-8 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        <button
          className={`
            flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${
              task.completed
                ? "bg-primary-600 border-primary-600"
                : "border-gray-300 dark:border-gray-500 hover:border-primary-500"
            }
            ${toggling ? "animate-check-pop" : ""}
          `}
          onClick={handleToggle}
          aria-label={
            task.completed ? "Marcar como incompleta" : "Marcar como concluída"
          }
          disabled={toggling}
        >
          {task.completed && (
            <svg
              className="w-3 h-3 text-white"
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

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {task.priority && task.priority !== "none" && (
              <span className={`text-xs font-medium ${priority.color}`}>
                ● {priority.label}
              </span>
            )}

            {dueDate && (
              <span
                className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-400 dark:text-gray-500"}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"
                  />
                </svg>
                {format(dueDate, "dd MMM", { locale: ptBR })}
                {isOverdue && " (atrasada)"}
              </span>
            )}

            {totalSubs > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z"
                  />
                </svg>
                {completedSubs}/{totalSubs}
              </span>
            )}

            {task.myDay && (
              <span className="text-xs text-blue-500"> Meu Dia</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
