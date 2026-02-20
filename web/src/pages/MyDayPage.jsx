import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TaskListView from "../components/tasks/TaskListView";
import { useTasks } from "../hooks/useTasks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MyDayPage() {
  const { openEdit, setPageSubtitle } = useOutletContext();
  const { tasks, loading } = useTasks({ myDay: true });

  const pending = tasks.filter((t) => !t.completed).length;
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    const count =
      pending === 1 ? "1 tarefa para hoje" : `${pending} tarefas para hoje`;
    setPageSubtitle(`${today} · ${count}`);
  }, [today, pending, setPageSubtitle]);

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
        emptyTitle="Dia livre!"
        emptyDescription="Nenhuma tarefa adicionada ao Meu Dia ainda."
        emptyVariant="myday"
        hint="Adicione tarefas ao Meu Dia pelo editor de tarefas"
      />
    </div>
  );
}
