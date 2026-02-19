import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NEW_TASK_EVENT = "todo:new-task";
export const SEARCH_FOCUS_EVENT = "todo:search-focus";

export default function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput =
        ["input", "textarea", "select"].includes(tag) ||
        document.activeElement?.isContentEditable;

      if (e.key === "Escape") return;

      if (isInput) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(NEW_TASK_EVENT));
      }

      if (e.key === "/") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(SEARCH_FOCUS_EVENT));
      }

      if (e.key === "1") navigate("/inbox");
      if (e.key === "2") navigate("/my-day");
      if (e.key === "3") navigate("/planned");
      if (e.key === "4") navigate("/completed");
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}
