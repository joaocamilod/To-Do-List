import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";

export default function PlannedPage() {
  const { openEdit } = useOutletContext();
  const { tasks, loading } = useTasks({ planned: true });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tasks.filter((t) => !t.completed).length} tarefa(s) com data futura
        </p>
      </div>
      <TaskListView
        tasks={tasks}
        onTaskClick={openEdit}
        emptyMessage="Nenhuma tarefa planejada. Defina uma data limite no editor."
      />
    </div>
  );
}
