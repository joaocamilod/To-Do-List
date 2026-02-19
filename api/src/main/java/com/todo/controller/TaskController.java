package com.todo.controller;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.service.TaskService;
import com.todo.websocket.SyncEventPublisher;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tarefas", description = "CRUD de tarefas e subtarefas")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;
    private final SyncEventPublisher syncPublisher;

    @GetMapping
    @Operation(summary = "Listar tarefas com filtros opcionais")
    public List<TaskResponse> getAll(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean myDay,
            @RequestParam(required = false) Boolean planned,
            @RequestParam(required = false) String search) {
        return taskService.getAll(user.getUsername(), listId, completed, myDay, planned, search);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tarefa por ID")
    public TaskResponse getById(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return taskService.getById(user.getUsername(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar nova tarefa")
    public TaskResponse create(@AuthenticationPrincipal UserDetails user,
                               @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.create(user.getUsername(), request);
        syncPublisher.publishToUser(user.getUsername(), "TASK_CREATED", task);
        return task;
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tarefa")
    public TaskResponse update(@AuthenticationPrincipal UserDetails user,
                               @PathVariable Long id,
                               @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.update(user.getUsername(), id, request);
        syncPublisher.publishToUser(user.getUsername(), "TASK_UPDATED", task);
        return task;
    }

    @PatchMapping("/{id}/toggle-complete")
    @Operation(summary = "Alternar conclusão da tarefa")
    public TaskResponse toggleComplete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        TaskResponse task = taskService.toggleComplete(user.getUsername(), id);
        syncPublisher.publishToUser(user.getUsername(), "TASK_UPDATED", task);
        return task;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir tarefa")
    public void delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        taskService.delete(user.getUsername(), id);
        syncPublisher.publishToUser(user.getUsername(), "TASK_DELETED", java.util.Map.of("id", id));
    }

    @PostMapping("/{taskId}/subtasks")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar subtarefa")
    public TaskResponse.SubtaskResponse createSubtask(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable Long taskId,
                                                       @Valid @RequestBody TaskRequest.SubtaskRequest req) {
        return taskService.createSubtask(user.getUsername(), taskId, req);
    }

    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    @Operation(summary = "Atualizar subtarefa")
    public TaskResponse.SubtaskResponse updateSubtask(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable Long taskId,
                                                       @PathVariable Long subtaskId,
                                                       @Valid @RequestBody TaskRequest.SubtaskRequest req) {
        return taskService.updateSubtask(user.getUsername(), taskId, subtaskId, req);
    }

    @PatchMapping("/{taskId}/subtasks/{subtaskId}/toggle")
    @Operation(summary = "Alternar conclusão de subtarefa")
    public TaskResponse.SubtaskResponse toggleSubtask(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable Long taskId,
                                                       @PathVariable Long subtaskId) {
        return taskService.toggleSubtask(user.getUsername(), taskId, subtaskId);
    }

    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir subtarefa")
    public void deleteSubtask(@AuthenticationPrincipal UserDetails user,
                               @PathVariable Long taskId,
                               @PathVariable Long subtaskId) {
        taskService.deleteSubtask(user.getUsername(), taskId, subtaskId);
    }
}
