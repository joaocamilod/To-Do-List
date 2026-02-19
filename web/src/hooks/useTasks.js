import { useMemo } from "react";
import { useTaskContext } from "../contexts/TaskContext";
import { isToday, isPast, isFuture, parseISO } from "date-fns";

export function useTasks(filters = {}) {
  const ctx = useTaskContext();

  const filteredTasks = useMemo(() => {
    let result = [...ctx.tasks];

    if (filters.listId !== undefined) {
      result = result.filter((t) => t.listId === filters.listId);
    }

    if (filters.myDay) {
      result = result.filter((t) => t.myDay === true);
    }

    if (filters.planned) {
      result = result.filter((t) => t.dueDate && isFuture(parseISO(t.dueDate)));
    }

    if (filters.completed !== undefined) {
      result = result.filter((t) => t.completed === filters.completed);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pOrder = { high: 0, medium: 1, low: 2, none: 3 };
      const pa = pOrder[a.priority || "none"];
      const pb = pOrder[b.priority || "none"];
      if (pa !== pb) return pa - pb;
      if (a.dueDate && b.dueDate)
        return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

    return result;
  }, [
    ctx.tasks,
    filters.listId,
    filters.myDay,
    filters.planned,
    filters.completed,
    filters.search,
  ]);

  return {
    tasks: filteredTasks,
    loading: ctx.loading,
    error: ctx.error,
    createTask: ctx.createTask,
    updateTask: ctx.updateTask,
    deleteTask: ctx.deleteTask,
    toggleComplete: ctx.toggleComplete,
    fetchTasks: ctx.fetchTasks,
  };
}
