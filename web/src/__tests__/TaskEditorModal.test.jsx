import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskEditorModal from "../components/tasks/TaskEditorModal";
import { TaskContext } from "../contexts/TaskContext";

function renderModal(overrides = {}, task = null) {
  const ctx = {
    createTask: jest.fn().mockResolvedValue({ id: 99, title: "Nova Tarefa" }),
    updateTask: jest.fn().mockResolvedValue({}),
    lists: [],
    ...overrides,
  };
  return render(
    <TaskContext.Provider value={ctx}>
      <TaskEditorModal task={task} onClose={jest.fn()} />
    </TaskContext.Provider>,
  );
}

describe("TaskEditorModal", () => {
  test("renderiza o modal de criação", () => {
    renderModal();
    expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
  });

  test("exibe erro ao tentar salvar sem título", async () => {
    renderModal();
    fireEvent.click(screen.getByRole("button", { name: /Criar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
    });
  });

  test("chama createTask com o título preenchido", async () => {
    const createTask = jest
      .fn()
      .mockResolvedValue({ id: 1, title: "Minha Tarefa" });
    renderModal({ createTask });

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: "Minha Tarefa" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Criar Tarefa/i }));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Minha Tarefa" }),
      );
    });
  });

  test('exibe "Editar Tarefa" no modo de edição', () => {
    const task = {
      id: 1,
      title: "Tarefa existente",
      priority: "low",
      completed: false,
      subtasks: [],
    };
    renderModal({}, task);
    expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tarefa existente")).toBeInTheDocument();
  });

  test("fecha com Escape", () => {
    const onClose = jest.fn();
    const ctx = {
      createTask: jest.fn(),
      updateTask: jest.fn(),
      lists: [],
    };
    render(
      <TaskContext.Provider value={ctx}>
        <TaskEditorModal task={null} onClose={onClose} />
      </TaskContext.Provider>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
