import React, { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import TaskEditorModal from "../tasks/TaskEditorModal";
import FloatingActionButton from "../ui/FloatingActionButton";
import { NEW_TASK_EVENT } from "../../hooks/useKeyboardShortcuts";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [pageSubtitle, setPageSubtitle] = useState("");

  useEffect(() => {
    const handler = () => setShowNewTaskModal(true);
    window.addEventListener(NEW_TASK_EVENT, handler);
    return () => window.removeEventListener(NEW_TASK_EVENT, handler);
  }, []);

  const openEdit = useCallback((task) => setEditingTask(task), []);

  const closeModal = useCallback(() => {
    setEditingTask(null);
    setShowNewTaskModal(false);
  }, []);

  const handleNewTask = useCallback(() => setShowNewTaskModal(true), []);

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full
          transform transition-[transform,width] duration-[220ms] ease-smooth
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarCollapsed ? "w-[72px]" : "w-[260px]"}
          flex-shrink-0
        `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          onClose={() => setSidebarOpen(false)}
          onNewTask={handleNewTask}
        />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          onNewTask={handleNewTask}
          subtitle={pageSubtitle}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet context={{ openEdit, setPageSubtitle }} />
        </main>
      </div>

      <FloatingActionButton onClick={handleNewTask} />

      {(showNewTaskModal || editingTask) && (
        <TaskEditorModal task={editingTask} onClose={closeModal} />
      )}
    </div>
  );
}
