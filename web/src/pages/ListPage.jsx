import React, { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";
import { useLists } from "../hooks/useLists";

export default function ListPage() {
  const { listId } = useParams();
  const { openEdit } = useOutletContext();
  const { lists } = useLists();
  const numericId = parseInt(listId, 10);
  const { tasks, loading } = useTasks({ listId: numericId });

  const list = lists.find((l) => l.id === numericId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-400">Lista não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: list.color || "#3b82f6" }}
        />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {list.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tasks.filter((t) => !t.completed).length} pendente(s)
          </p>
        </div>
      </div>
      <TaskListView
        tasks={tasks}
        onTaskClick={openEdit}
        emptyMessage={`Nenhuma tarefa em "${list.name}" ainda.`}
      />
    </div>
  );
}
