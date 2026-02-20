import React, { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import EmptyState from "../ui/EmptyState";
import { useTaskContext } from "../../contexts/TaskContext";

const VARIANT_MAP = {
  "Nenhuma tarefa para hoje": "myday",
  "Nenhuma tarefa planejada": "planned",
  "Nenhuma tarefa concluída": "completed",
};

function resolveVariant(msg) {
  for (const [key, variant] of Object.entries(VARIANT_MAP)) {
    if (msg?.startsWith(key)) return variant;
  }
  return "tasks";
}

export default function TaskListView({
  tasks,
  onTaskClick,
  emptyTitle = "Tudo limpo por aqui!",
  emptyDescription = "Adicione uma nova tarefa para começar.",
  emptyMessage,
  emptyVariant,
  onAddTask,
}) {
  const { setTasks } = useTaskContext();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveId(null);
      if (!over || active.id === over.id) return;
      setTasks((prev) => {
        const oldIdx = prev.findIndex((t) => t.id === active.id);
        const newIdx = prev.findIndex((t) => t.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return prev;
        return arrayMove(prev, oldIdx, newIdx);
      });
    },
    [setTasks],
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  if (!tasks || tasks.length === 0) {
    const variant =
      emptyVariant ?? resolveVariant(emptyMessage ?? emptyDescription);
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-4rem)]">
        <EmptyState
          variant={variant}
          title={emptyTitle}
          description={emptyMessage ?? emptyDescription}
          cta={onAddTask ? "Adicionar Tarefa" : undefined}
          onCta={onAddTask}
          hint="Pressione N para criar uma nova tarefa rapidamente"
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 p-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{ duration: 160, easing: "cubic-bezier(.2,.8,.2,1)" }}
      >
        {activeTask && (
          <div className="rotate-1 opacity-90 shadow-modal">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
