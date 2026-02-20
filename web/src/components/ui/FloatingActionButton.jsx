import React from "react";

export default function FloatingActionButton({
  onClick,
  label = "Nova Tarefa",
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="
        fixed bottom-6 right-5 z-40
        w-14 h-14 rounded-full
        bg-primary-600 hover:bg-primary-500 active:bg-primary-700
        text-white shadow-fab
        flex items-center justify-center
        transition-all duration-[160ms] ease-smooth
        hover:scale-105 active:scale-95
        focus-visible:ring-4 focus-visible:ring-primary-400/50
        animate-fab-bounce
        lg:hidden
      "
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  );
}
