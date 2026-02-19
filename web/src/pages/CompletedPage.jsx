import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";
import { useTaskContext } from "../contexts/TaskContext";

export default function CompletedPage() {
  const { openEdit } = useOutletContext();
  const { tasks, loading } = useTasks({ completed: true });

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
          {tasks.length} tarefa(s) concluída(s)
        </p>
      </div>
      <TaskListView
        tasks={tasks}
        onTaskClick={openEdit}
        emptyMessage="Nenhuma tarefa concluída ainda. Continue assim! 💪"
      />
    </div>
  );
}
