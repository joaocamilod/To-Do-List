import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 220);
  }, []);

  const addToast = useCallback(
    ({ message, type = "success", duration = 4000, action }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev.slice(-3),
        { id, message, type, action, leaving: false },
      ]);

      if (duration > 0) {
        timerRef.current[id] = setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast],
  );

  const dismissToast = useCallback(
    (id) => {
      clearTimeout(timerRef.current[id]);
      removeToast(id);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const TYPE_STYLES = {
  success: {
    bar: "bg-green-500",
    icon: (
      <svg
        className="w-4 h-4 text-green-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    ),
  },
  error: {
    bar: "bg-red-500",
    icon: (
      <svg
        className="w-4 h-4 text-red-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  info: {
    bar: "bg-primary-500",
    icon: (
      <svg
        className="w-4 h-4 text-primary-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    bar: "bg-yellow-500",
    icon: (
      <svg
        className="w-4 h-4 text-yellow-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
        />
      </svg>
    ),
  },
};

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: "min(360px, calc(100vw - 2rem))" }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3
        bg-[var(--color-surface)] border border-[var(--color-border)]
        rounded-xl shadow-toast overflow-hidden
        ${toast.leaving ? "animate-toast-out" : "animate-toast-in"}
      `}
    >
      <div
        className={`w-1 self-stretch rounded-full flex-shrink-0 ${style.bar}`}
      />
      {style.icon}
      <p className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
        {toast.message}
      </p>
      {toast.action && (
        <button
          onClick={() => {
            toast.action.onClick();
            onDismiss(toast.id);
          }}
          className="text-xs font-semibold text-primary-500 hover:text-primary-400 whitespace-nowrap transition-colors"
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 text-[var(--color-text-muted)] transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
