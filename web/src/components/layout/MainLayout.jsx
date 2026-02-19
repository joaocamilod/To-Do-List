import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import TaskEditorModal from "../tasks/TaskEditorModal";
import { useEffect } from "react";
import { NEW_TASK_EVENT } from "../../hooks/useKeyboardShortcuts";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  useEffect(() => {
    const handler = () => setShowNewTaskModal(true);
    window.addEventListener(NEW_TASK_EVENT, handler);
    return () => window.removeEventListener(NEW_TASK_EVENT, handler);
  }, []);

  const openEdit = useCallback((task) => {
    setEditingTask(task);
  }, []);

  const closeModal = useCallback(() => {
    setEditingTask(null);
    setShowNewTaskModal(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-72 transform transition-transform duration-300
          lg:relative lg:translate-x-0 lg:block
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onNewTask={() => setShowNewTaskModal(true)}
        />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          onNewTask={() => setShowNewTaskModal(true)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet context={{ openEdit }} />
        </main>
      </div>

      {(showNewTaskModal || editingTask) && (
        <TaskEditorModal task={editingTask} onClose={closeModal} />
      )}
    </div>
  );
}
