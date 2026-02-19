package com.todo.service;

import com.todo.dto.TaskListRequest;
import com.todo.dto.TaskListResponse;
import com.todo.model.TaskList;
import com.todo.model.User;
import com.todo.repository.TaskListRepository;
import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository listRepository;
    private final UserRepository userRepository;

    public List<TaskListResponse> getAll(String email) {
        User user = getUser(email);
        return listRepository.findByUserIdOrderByCreatedAtAsc(user.getId())
                .stream().map(TaskListResponse::from).toList();
    }

    @Transactional
    public TaskListResponse create(String email, TaskListRequest request) {
        User user = getUser(email);
        TaskList list = TaskList.builder()
                .name(request.getName())
                .color(request.getColor())
                .user(user)
                .build();
        return TaskListResponse.from(listRepository.save(list));
    }

    @Transactional
    public TaskListResponse update(String email, Long id, TaskListRequest request) {
        TaskList list = getOwnedList(email, id);
        list.setName(request.getName());
        if (request.getColor() != null) list.setColor(request.getColor());
        return TaskListResponse.from(listRepository.save(list));
    }

    @Transactional
    public void delete(String email, Long id) {
        TaskList list = getOwnedList(email, id);
        listRepository.delete(list);
    }

    private TaskList getOwnedList(String email, Long id) {
        User user = getUser(email);
        return listRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new AccessDeniedException("Lista não encontrada ou sem permissão"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + email));
    }
}
