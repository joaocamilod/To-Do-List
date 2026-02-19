import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TaskProvider } from "./contexts/TaskContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InboxPage from "./pages/InboxPage";
import MyDayPage from "./pages/MyDayPage";
import PlannedPage from "./pages/PlannedPage";
import CompletedPage from "./pages/CompletedPage";
import ListPage from "./pages/ListPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

function AppContent() {
  useKeyboardShortcuts();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/inbox" replace />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="my-day" element={<MyDayPage />} />
        <Route path="planned" element={<PlannedPage />} />
        <Route path="completed" element={<CompletedPage />} />
        <Route path="list/:listId" element={<ListPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/inbox" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <WebSocketProvider>
            <AppContent />
          </WebSocketProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
