import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";

export default function PlannedPage() {
  const { openEdit, setPageSubtitle } = useOutletContext();
  const { tasks, loading } = useTasks({ planned: true });

  const count = tasks.filter((t) => !t.completed).length;

  useEffect(() => {
    const label =
      count === 1
        ? "1 tarefa com data futura"
        : `${count} tarefas com data futura`;
    setPageSubtitle(label);
  }, [count, setPageSubtitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TaskListView
        tasks={tasks}
        onTaskClick={openEdit}
        emptyTitle="Nenhuma tarefa planejada"
        emptyDescription="Defina uma data limite numa tarefa para ela aparecer aqui."
        emptyVariant="planned"
      />
    </div>
  );
}
