INSERT INTO users (name, email, password, created_at, updated_at)
VALUES (
    'Usuário Demo',
    'demo@todo.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
    demo_user_id BIGINT;
    list_pessoal BIGINT;
    list_trabalho BIGINT;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@todo.com';

    INSERT INTO task_lists (name, color, user_id)
    VALUES ('Pessoal', '#3b82f6', demo_user_id)
    RETURNING id INTO list_pessoal;

    INSERT INTO task_lists (name, color, user_id)
    VALUES ('Trabalho', '#10b981', demo_user_id)
    RETURNING id INTO list_trabalho;

    INSERT INTO tasks (title, description, completed, priority, my_day, position, user_id)
    VALUES
        ('Revisar emails', 'Verificar caixa de entrada e responder pendências', FALSE, 'HIGH', TRUE, 1, demo_user_id),
        ('Ligar para o banco', NULL, FALSE, 'MEDIUM', FALSE, 2, demo_user_id),
        ('Meditar 10 minutos', 'Usar app Headspace', FALSE, 'LOW', TRUE, 3, demo_user_id);

    INSERT INTO tasks (title, description, completed, priority, my_day, due_date, position, user_id, list_id)
    VALUES
        ('Comprar leite', 'Leite desnatado 1L', FALSE, 'MEDIUM', FALSE,
         NOW() + INTERVAL '2 days', 1, demo_user_id, list_pessoal),
        ('Academina — treino peito', NULL, FALSE, 'HIGH', TRUE,
         NOW() + INTERVAL '1 day', 2, demo_user_id, list_pessoal),
        ('Pagar aluguel', 'Vence no dia 10', FALSE, 'HIGH', FALSE,
         NOW() + INTERVAL '5 days', 3, demo_user_id, list_pessoal);

    INSERT INTO tasks (title, description, completed, priority, due_date, position, user_id, list_id)
    VALUES
        ('Preparar apresentação Q2', 'Slides para a reunião de sexta', FALSE, 'HIGH',
         NOW() + INTERVAL '3 days', 1, demo_user_id, list_trabalho),
        ('Code review do PR #42', NULL, FALSE, 'MEDIUM',
         NOW() + INTERVAL '1 day', 2, demo_user_id, list_trabalho),
        ('Documentar API de autenticação', 'Atualizar Swagger e README', FALSE, 'LOW',
         NOW() + INTERVAL '7 days', 3, demo_user_id, list_trabalho);

    INSERT INTO tasks (title, completed, priority, position, user_id)
    VALUES ('Setup do projeto Todo App', TRUE, 'HIGH', 0, demo_user_id);

    INSERT INTO subtasks (title, completed, task_id)
    SELECT 'Verificar validade', FALSE, t.id
    FROM tasks t WHERE t.title = 'Comprar leite' AND t.user_id = demo_user_id;

    INSERT INTO subtasks (title, completed, task_id)
    SELECT 'Colocar na geladeira', FALSE, t.id
    FROM tasks t WHERE t.title = 'Comprar leite' AND t.user_id = demo_user_id;

    INSERT INTO subtasks (title, completed, task_id)
    SELECT 'Criar outline', TRUE, t.id
    FROM tasks t WHERE t.title = 'Preparar apresentação Q2' AND t.user_id = demo_user_id;

    INSERT INTO subtasks (title, completed, task_id)
    SELECT 'Adicionar gráficos', FALSE, t.id
    FROM tasks t WHERE t.title = 'Preparar apresentação Q2' AND t.user_id = demo_user_id;

    INSERT INTO subtasks (title, completed, task_id)
    SELECT 'Revisar com o gerente', FALSE, t.id
    FROM tasks t WHERE t.title = 'Preparar apresentação Q2' AND t.user_id = demo_user_id;

END $$;
