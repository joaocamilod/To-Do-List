import React, { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";
import { useLists } from "../hooks/useLists";

export default function ListPage() {
  const { listId } = useParams();
  const { openEdit, setPageSubtitle } = useOutletContext();
  const { lists } = useLists();
  const numericId = parseInt(listId, 10);
  const { tasks, loading } = useTasks({ listId: numericId });

  const list = lists.find((l) => l.id === numericId);
  const pending = tasks.filter((t) => !t.completed).length;

  useEffect(() => {
    if (!list) return;
    const label = pending === 1 ? "1 pendente" : `${pending} pendentes`;
    setPageSubtitle(label);
  }, [list, pending, setPageSubtitle]);

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
        <p className="text-[var(--color-text-muted)]">Lista não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TaskListView
        tasks={tasks}
        onTaskClick={openEdit}
        emptyTitle={`"${list.name}" está vazia`}
        emptyDescription="Adicione tarefas a esta lista pelo editor."
      />
    </div>
  );
}
