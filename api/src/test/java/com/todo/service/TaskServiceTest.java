package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.model.Task;
import com.todo.model.User;
import com.todo.repository.SubtaskRepository;
import com.todo.repository.TaskListRepository;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService - Testes Unitários")
class TaskServiceTest {

    @Mock TaskRepository taskRepository;
    @Mock SubtaskRepository subtaskRepository;
    @Mock UserRepository userRepository;
    @Mock TaskListRepository listRepository;

    @InjectMocks TaskService taskService;

    private User user;
    private Task task;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@test.com")
                .password("encoded")
                .build();

        task = Task.builder()
                .id(10L)
                .title("Tarefa Teste")
                .priority(Task.Priority.MEDIUM)
                .completed(false)
                .user(user)
                .position(0)
                .build();
    }

    @Test
    @DisplayName("Deve criar tarefa com sucesso")
    void shouldCreateTask() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> {
            Task t = inv.getArgument(0);
            t.setId(10L);
            return t;
        });

        TaskRequest req = new TaskRequest();
        req.setTitle("Nova Tarefa");
        req.setPriority(Task.Priority.HIGH);

        TaskResponse result = taskService.create("test@test.com", req);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Nova Tarefa");
        assertThat(result.getPriority()).isEqualTo("high");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Deve alternar conclusão da tarefa")
    void shouldToggleTaskCompletion() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse result = taskService.toggleComplete("test@test.com", 10L);

        assertThat(result.isCompleted()).isTrue();
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao acessar tarefa de outro usuário")
    void shouldThrowWhenTaskNotOwned() {
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(
                User.builder().id(99L).email("other@test.com").build()
        ));
        when(taskRepository.findByIdAndUserId(10L, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getById("other@test.com", 10L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    @DisplayName("Deve listar tarefas do Inbox (sem lista)")
    void shouldGetInboxTasks() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByUserIdAndListIdIsNullOrderByPositionAscCreatedAtDesc(1L))
                .thenReturn(List.of(task));

        List<TaskResponse> result = taskService.getAll("test@test.com", null, null, null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Tarefa Teste");
    }

    @Test
    @DisplayName("Deve deletar tarefa com sucesso")
    void shouldDeleteTask() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));
        doNothing().when(taskRepository).delete(task);

        assertThatCode(() -> taskService.delete("test@test.com", 10L))
                .doesNotThrowAnyException();

        verify(taskRepository).delete(task);
    }

    @Test
    @DisplayName("Deve atualizar título e prioridade da tarefa")
    void shouldUpdateTask() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskRequest req = new TaskRequest();
        req.setTitle("Título Atualizado");
        req.setPriority(Task.Priority.HIGH);

        TaskResponse result = taskService.update("test@test.com", 10L, req);

        assertThat(result.getTitle()).isEqualTo("Título Atualizado");
        assertThat(result.getPriority()).isEqualTo("high");
    }
}
