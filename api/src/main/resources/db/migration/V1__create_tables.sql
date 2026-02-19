-- Usuários
CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(255)        NOT NULL UNIQUE,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Listas de tarefas
CREATE TABLE IF NOT EXISTS task_lists (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    color      VARCHAR(20)         DEFAULT '#3b82f6',
    user_id    BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_lists_user_id ON task_lists(user_id);

-- Tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(200)        NOT NULL,
    description TEXT,
    completed   BOOLEAN             NOT NULL DEFAULT FALSE,
    priority    VARCHAR(20)         NOT NULL DEFAULT 'NONE',
    due_date    TIMESTAMP,
    reminder    TIMESTAMP,
    my_day      BOOLEAN             NOT NULL DEFAULT FALSE,
    position    INTEGER             NOT NULL DEFAULT 0,
    user_id     BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    list_id     BIGINT              REFERENCES task_lists(id) ON DELETE SET NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id  ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id  ON tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Subtarefas
CREATE TABLE IF NOT EXISTS subtasks (
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(200)        NOT NULL,
    completed  BOOLEAN             NOT NULL DEFAULT FALSE,
    task_id    BIGINT              NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
