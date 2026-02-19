import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { AuthContext } from "../contexts/AuthContext";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

function renderLogin(overrides = {}) {
  const ctx = {
    login: jest.fn().mockResolvedValue({}),
    ...overrides,
  };
  return render(
    <AuthContext.Provider value={ctx}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("renderiza o formulário de login", () => {
    renderLogin();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  test("exibe erro quando login falha", async () => {
    const login = jest
      .fn()
      .mockRejectedValue(new Error("Credenciais inválidas"));
    renderLogin({ login });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  test("chama login com os dados corretos", async () => {
    const login = jest.fn().mockResolvedValue({});
    renderLogin({ login });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "demo@todo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "demo123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("demo@todo.com", "demo123");
    });
  });

  test("mostra dica de usuário demo", () => {
    renderLogin();
    expect(screen.getByText(/demo@todo.com/i)).toBeInTheDocument();
  });
});
