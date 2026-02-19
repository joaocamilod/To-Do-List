package com.todo.controller;

import com.todo.dto.TaskListRequest;
import com.todo.dto.TaskListResponse;
import com.todo.service.TaskListService;
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
@RequestMapping("/api/lists")
@RequiredArgsConstructor
@Tag(name = "Listas", description = "CRUD de listas de tarefas")
@SecurityRequirement(name = "bearerAuth")
public class TaskListController {

    private final TaskListService service;

    @GetMapping
    @Operation(summary = "Listar todas as listas do usuário")
    public List<TaskListResponse> getAll(@AuthenticationPrincipal UserDetails user) {
        return service.getAll(user.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar nova lista")
    public TaskListResponse create(@AuthenticationPrincipal UserDetails user,
                                   @Valid @RequestBody TaskListRequest request) {
        return service.create(user.getUsername(), request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar lista")
    public TaskListResponse update(@AuthenticationPrincipal UserDetails user,
                                   @PathVariable Long id,
                                   @Valid @RequestBody TaskListRequest request) {
        return service.update(user.getUsername(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir lista e suas tarefas")
    public void delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        service.delete(user.getUsername(), id);
    }
}
