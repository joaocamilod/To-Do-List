import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { taskService } from "../services/taskService";
import { listService } from "../services/listService";
import { useAuth } from "./AuthContext";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      loadAll();
    }

    if (!isAuthenticated) {
      hasFetched.current = false;
      setTasks([]);
      setLists([]);
    }
  }, [isAuthenticated, authLoading]);

  async function loadAll() {
    setLoading(true);
    try {
      const [listsData, tasksData] = await Promise.all([
        listService.getAll(),
        taskService.getAll(),
      ]);
      setLists(listsData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchLists = useCallback(async () => {
    try {
      const data = await listService.getAll();
      setLists(data);
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
    }
  }, []);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await taskService.getAll(filters);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    const created = await taskService.create(taskData);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    const updated = await taskService.update(id, taskData);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskService.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id) => {
    const updated = await taskService.toggleComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const createList = useCallback(async (listData) => {
    const created = await listService.create(listData);
    setLists((prev) => [...prev, created]);
    return created;
  }, []);

  const updateList = useCallback(async (id, listData) => {
    const updated = await listService.update(id, listData);
    setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  const deleteList = useCallback(async (id) => {
    await listService.delete(id);
    setLists((prev) => prev.filter((l) => l.id !== id));
    setTasks((prev) => prev.filter((t) => t.listId !== id));
  }, []);

  const handleWsEvent = useCallback((event) => {
    const { type, payload } = event;
    switch (type) {
      case "TASK_CREATED":
        setTasks((prev) => {
          if (prev.find((t) => t.id === payload.id)) return prev;
          return [payload, ...prev];
        });
        break;
      case "TASK_UPDATED":
        setTasks((prev) =>
          prev.map((t) => (t.id === payload.id ? payload : t)),
        );
        break;
      case "TASK_DELETED":
        setTasks((prev) => prev.filter((t) => t.id !== payload.id));
        break;
      case "LIST_CREATED":
        setLists((prev) => {
          if (prev.find((l) => l.id === payload.id)) return prev;
          return [...prev, payload];
        });
        break;
      case "LIST_UPDATED":
        setLists((prev) =>
          prev.map((l) => (l.id === payload.id ? payload : l)),
        );
        break;
      case "LIST_DELETED":
        setLists((prev) => prev.filter((l) => l.id !== payload.id));
        break;
    }
  }, []);

  const value = {
    tasks,
    lists,
    loading,
    error,
    fetchTasks,
    fetchLists,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    createList,
    updateList,
    deleteList,
    handleWsEvent,
    setTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx)
    throw new Error("useTaskContext deve ser usado dentro de TaskProvider");
  return ctx;
}
