# Todo App — Monorepo (Web + API)

Aplicação To-Do inspirada no Microsoft To Do. Frontend responsivo com suporte a PWA, backend RESTful com autenticação JWT e sincronização em tempo real via WebSocket.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue)
![Stack](https://img.shields.io/badge/Backend-Spring%20Boot%203%20%2B%20Java%2017-green)
![Stack](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Stack](https://img.shields.io/badge/Auth-JWT-orange)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar](#como-rodar)
  - [Com Docker (recomendado)](#com-docker-recomendado)
  - [Sem Docker — Frontend](#sem-docker--frontend)
  - [Sem Docker — Backend](#sem-docker--backend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [API — Endpoints](#api--endpoints)
- [WebSocket](#websocket)
- [Atalhos de Teclado](#atalhos-de-teclado)
- [Testes](#testes)
- [Estrutura de Código](#estrutura-de-código)
- [Usuário Demo](#usuário-demo)
- [Stack Completa](#stack-completa)

---

## Visão Geral

| Serviço | URL padrão |
|---------|-----------|
| Frontend | http://localhost:5173 |
| API REST | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Adminer (DB) | http://localhost:8090 |

---

## Funcionalidades

### Frontend
- Autenticação com JWT (login, registro, refresh token)
- Sidebar com listas customizadas por usuário
- Visões: **Inbox**, **Meu Dia**, **Planejado**, **Concluídas**
- CRUD completo de tarefas e subtarefas (checklist)
- Due date, lembretes e prioridade (baixa, média, alta)
- Modal/drawer de edição completo
- Drag & drop de tarefas entre listas (`@dnd-kit`)
- Tema claro/escuro com persistência no `localStorage`
- Design responsivo mobile-first
- PWA: `manifest.json` + Service Worker com cache offline
- Sincronização em tempo real via WebSocket/STOMP
- Busca de tarefas
- Atalhos de teclado
- Acessibilidade (`aria-*`, foco gerenciável)

### Backend
- Autenticação JWT (registro, login, refresh)
- CRUD de usuários, listas, tarefas e subtarefas
- Filtros de tarefas: `listId`, `completed`, `myDay`, `planned`, `search`
- Reordenação de tarefas
- WebSocket STOMP para sincronização em tempo real
- Migrations automáticas com Flyway + seed de dados demo
- Documentação interativa com Swagger/OpenAPI
- Testes unitários e de integração com JUnit + Mockito
- Docker + docker-compose

---

## Estrutura do Projeto

```
C:\ToDoList
├── docker-compose.yml
├── env.example
├── web/                        # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── contexts/           # Contextos React (Auth, Theme, Task, WebSocket)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Chamadas HTTP (axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── icons/              # Ícones PWA
│   │   └── manifest.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── api/                        # Backend Spring Boot
    └── src/main/java/com/todo/
        ├── config/             # Security, WebSocket, Swagger
        ├── controller/         # Endpoints REST
        ├── service/            # Regras de negócio
        ├── model/              # Entidades JPA
        ├── repository/         # Spring Data JPA
        ├── dto/                # Request/Response DTOs
        ├── security/           # JWT provider e filtros
        ├── websocket/          # STOMP sync
        └── exception/          # Handler global
```

---

## Como Rodar

### Com Docker (recomendado)

Sobe o frontend, backend e banco de dados com um único comando:

```bash
# 1. Clone o repositório e entre na pasta
cd C:\ToDoList

# 2. Copie e configure as variáveis de ambiente
cp env.example .env

# 3. Suba tudo
docker-compose up --build
```

### Sem Docker — Frontend

```bash
cd web

# Instalar dependências
npm install

# Dev server com hot reload → http://localhost:5173
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

Crie o arquivo `web/.env` (ou `.env.local`) com:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

### Sem Docker — Backend

**Pré-requisitos:** Java 17+, PostgreSQL 15+ rodando localmente.

```bash
# Crie o banco de dados
psql -U postgres
```
```sql
CREATE DATABASE tododb;
CREATE USER todouser WITH PASSWORD 'todopassword';
GRANT ALL PRIVILEGES ON DATABASE tododb TO todouser;
```

```bash
cd api

# Rodar com Maven Wrapper (Linux/macOS)
./mvnw spring-boot:run

# Rodar com Maven Wrapper (Windows)
mvnw.cmd spring-boot:run

# Build do JAR
./mvnw package -DskipTests
java -jar target/todo-api-1.0.0.jar
```

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `POSTGRES_DB` | `tododb` | Nome do banco |
| `POSTGRES_USER` | `todouser` | Usuário do banco |
| `POSTGRES_PASSWORD` | `todopassword` | Senha do banco |
| `JWT_SECRET` | `changeme-secret-key-very-long` | Segredo JWT — altere em produção |
| `VITE_API_URL` | `http://localhost:8080` | URL da API no frontend |
| `VITE_WS_URL` | `ws://localhost:8080/ws` | URL do WebSocket no frontend |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/tododb` | JDBC URL (sem Docker) |

Veja `env.example` para a lista completa.

---

## API — Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login — retorna JWT |
| GET | `/api/auth/me` | Usuário autenticado |

### Listas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/lists` | Listar todas as listas |
| POST | `/api/lists` | Criar lista |
| PUT | `/api/lists/{id}` | Atualizar lista |
| DELETE | `/api/lists/{id}` | Excluir lista |

### Tarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tasks` | Listar tarefas (filtros: `listId`, `completed`, `myDay`, `planned`, `search`) |
| GET | `/api/tasks/{id}` | Buscar tarefa por ID |
| POST | `/api/tasks` | Criar tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| PATCH | `/api/tasks/{id}/toggle-complete` | Alternar conclusão |
| DELETE | `/api/tasks/{id}` | Excluir tarefa |

### Subtarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/tasks/{id}/subtasks` | Criar subtarefa |
| PUT | `/api/tasks/{taskId}/subtasks/{subId}` | Atualizar subtarefa |
| PATCH | `/api/tasks/{taskId}/subtasks/{subId}/toggle` | Alternar conclusão da subtarefa |
| DELETE | `/api/tasks/{taskId}/subtasks/{subId}` | Excluir subtarefa |

A documentação interativa completa está disponível em: **http://localhost:8080/swagger-ui.html**

---

## WebSocket

Sincronização em tempo real entre múltiplos clientes via STOMP sobre SockJS.

| Configuração | Valor |
|---|---|
| Endpoint | `ws://localhost:8080/ws` (via SockJS) |
| Protocolo | STOMP |
| Autenticação | Header `Authorization: Bearer <token>` |
| Subscrição privada | `/user/queue/events` |
| Tópico broadcast | `/topic/sync` |

Eventos emitidos pelo servidor:

```json
{ "type": "TASK_CREATED", "payload": { "...task" } }
{ "type": "TASK_UPDATED", "payload": { "...task" } }
{ "type": "TASK_DELETED", "payload": { "id": 123 } }
```

---

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `N` | Nova tarefa |
| `/` | Focar na busca |
| `1` | Ir para Inbox |
| `2` | Ir para Meu Dia |
| `3` | Ir para Planejado |
| `4` | Ir para Concluídas |
| `Esc` | Fechar modal |

---

## Testes

### Frontend

```bash
cd web

# Rodar todos os testes
npm run test

# Modo watch
npm run test:watch
```

Cobertura: `TaskCard`, `LoginPage`, `TaskEditorModal` — framework: **Jest + @testing-library/react**

### Backend

```bash
cd api
./mvnw test
```

Cobertura:
- `TaskServiceTest` — 6 testes unitários
- `AuthServiceTest` — 4 testes unitários
- `AuthControllerTest` — 3 testes de integração (MockMvc)

---

## Estrutura de Código

### Frontend (`web/src`)

```
contexts/
  AuthContext.jsx         # Estado e fluxo de autenticação JWT
  ThemeContext.jsx        # Tema claro/escuro
  TaskContext.jsx         # Estado global de tarefas e listas
  WebSocketContext.jsx    # Conexão STOMP e sincronização
hooks/
  useAuth.js
  useTasks.js
  useLists.js
  useKeyboardShortcuts.js
services/
  api.js                  # Axios com interceptor JWT
  authService.js
  taskService.js
  listService.js
components/
  auth/ProtectedRoute.jsx
  layout/MainLayout.jsx, Sidebar.jsx, TopBar.jsx
  tasks/TaskCard.jsx, TaskListView.jsx, TaskEditorModal.jsx
pages/
  LoginPage.jsx, RegisterPage.jsx
  InboxPage.jsx, MyDayPage.jsx, PlannedPage.jsx
  CompletedPage.jsx, ListPage.jsx
```

### Backend (`api/src/main/java/com/todo`)

```
config/
  SecurityConfig.java     # Spring Security + CORS
  WebSocketConfig.java    # STOMP WebSocket
  SwaggerConfig.java      # OpenAPI/Swagger
model/
  User.java, TaskList.java, Task.java, Subtask.java
repository/              # Spring Data JPA repositories
dto/                     # *Request.java, *Response.java
service/
  AuthService.java, TaskListService.java, TaskService.java
security/
  JwtTokenProvider.java, JwtAuthenticationFilter.java
controller/
  AuthController.java, TaskListController.java, TaskController.java
websocket/
  SyncController.java, SyncEventPublisher.java
exception/
  GlobalExceptionHandler.java
resources/db/migration/
  V1__create_tables.sql   # Schema do banco
  V2__seed_demo.sql       # Dados de demonstração
```

---

## Usuário Demo

```
Email: demo@todo.com
Senha: demo123
```

---

## Stack Completa

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Roteamento | React Router DOM |
| Estado | Context API + hooks customizados |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| HTTP | Axios |
| WebSocket (cliente) | @stomp/stompjs, sockjs-client |
| Datas | date-fns |
| PWA | vite-plugin-pwa, Workbox |
| Testes (frontend) | Jest, @testing-library/react |
| Backend | Spring Boot 3, Java 17 |
| Segurança | Spring Security, JWT |
| Banco de dados | PostgreSQL 15 |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway |
| WebSocket (servidor) | Spring WebSocket, STOMP |
| Documentação | SpringDoc OpenAPI (Swagger) |
| Testes (backend) | JUnit 5, Mockito, MockMvc |
| Containerização | Docker, docker-compose |
