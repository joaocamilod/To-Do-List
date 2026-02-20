import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";

export default function InboxPage() {
  const { openEdit, setPageSubtitle } = useOutletContext();
  const { tasks, loading } = useTasks({ listId: null });

  const inbox = tasks.filter((t) => !t.listId);
  const pending = inbox.filter((t) => !t.completed).length;

  useEffect(() => {
    const label =
      pending === 1 ? "1 tarefa pendente" : `${pending} tarefas pendentes`;
    setPageSubtitle(label);
  }, [pending, setPageSubtitle]);

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
        tasks={inbox}
        onTaskClick={openEdit}
        emptyTitle="Inbox vazio!"
        emptyDescription="Todas as tarefas foram concluídas ou organizadas."
        hint="Pressione N para criar uma nova tarefa rapidamente"
      />
    </div>
  );
}
