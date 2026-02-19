import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskCard from "../components/tasks/TaskCard";
import { TaskContext } from "../contexts/TaskContext";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));
jest.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

const mockTask = {
  id: 1,
  title: "Comprar leite",
  description: "Leite desnatado 1L",
  priority: "medium",
  completed: false,
  dueDate: null,
  myDay: false,
  subtasks: [],
};

function renderWithContext(task, overrides = {}) {
  const ctx = {
    toggleComplete: jest
      .fn()
      .mockResolvedValue({ ...task, completed: !task.completed }),
    ...overrides,
  };
  return render(
    <TaskContext.Provider value={ctx}>
      <TaskCard task={task} onClick={jest.fn()} />
    </TaskContext.Provider>,
  );
}

describe("TaskCard", () => {
  test("renderiza o título da tarefa", () => {
    renderWithContext(mockTask);
    expect(screen.getByText("Comprar leite")).toBeInTheDocument();
  });

  test("renderiza a descrição da tarefa", () => {
    renderWithContext(mockTask);
    expect(screen.getByText("Leite desnatado 1L")).toBeInTheDocument();
  });

  test("mostra badge de prioridade média", () => {
    renderWithContext(mockTask);
    expect(screen.getByText(/Média/i)).toBeInTheDocument();
  });

  test("chama toggleComplete ao clicar no checkbox", async () => {
    const toggleComplete = jest.fn().mockResolvedValue({});
    renderWithContext(mockTask, { toggleComplete });
    const checkBtn = screen.getByLabelText(/Marcar como concluída/i);
    fireEvent.click(checkBtn);
    expect(toggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  test("exibe tarefa concluída com line-through", () => {
    const completedTask = { ...mockTask, completed: true };
    renderWithContext(completedTask);
    const title = screen.getByText("Comprar leite");
    expect(title).toHaveClass("line-through");
  });

  test("chama onClick ao clicar no card", () => {
    const onClick = jest.fn();
    const ctx = { toggleComplete: jest.fn().mockResolvedValue({}) };
    render(
      <TaskContext.Provider value={ctx}>
        <TaskCard task={mockTask} onClick={onClick} />
      </TaskContext.Provider>,
    );
    const card = screen.getByRole("button", { name: /Tarefa: Comprar leite/i });
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledWith(mockTask);
  });
});
