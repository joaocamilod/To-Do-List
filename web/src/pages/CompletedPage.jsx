import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";

export default function CompletedPage() {
  const { openEdit, setPageSubtitle } = useOutletContext();
  const { tasks, loading } = useTasks({ completed: true });

  useEffect(() => {
    const label =
      tasks.length === 1
        ? "1 tarefa concluída"
        : `${tasks.length} tarefas concluídas`;
    setPageSubtitle(label);
  }, [tasks.length, setPageSubtitle]);

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
        emptyTitle="Nenhuma tarefa concluída ainda"
        emptyDescription="Marque tarefas como concluídas para vê-las aqui."
        emptyVariant="completed"
      />
    </div>
  );
}
