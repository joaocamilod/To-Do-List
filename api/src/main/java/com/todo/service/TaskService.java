package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.model.*;
import com.todo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final UserRepository userRepository;
    private final TaskListRepository listRepository;

    public List<TaskResponse> getAll(String email, Long listId, Boolean completed,
                                      Boolean myDay, Boolean planned, String search) {
        User user = getUser(email);
        List<Task> tasks;

        if (search != null && !search.isBlank()) {
            tasks = taskRepository.searchByUserIdAndQuery(user.getId(), search.trim());
        } else if (Boolean.TRUE.equals(myDay)) {
            tasks = taskRepository.findByUserIdAndMyDayTrueOrderByPositionAscCreatedAtDesc(user.getId());
        } else if (Boolean.TRUE.equals(planned)) {
            tasks = taskRepository.findByUserIdAndDueDateIsNotNullAndDueDateAfterOrderByDueDateAsc(
                    user.getId(), LocalDateTime.now());
        } else if (completed != null) {
            tasks = taskRepository.findByUserIdAndCompletedOrderByPositionAscCreatedAtDesc(user.getId(), completed);
        } else if (listId != null) {
            tasks = taskRepository.findByUserIdAndListIdOrderByPositionAscCreatedAtDesc(user.getId(), listId);
        } else {
            tasks = taskRepository.findByUserIdAndListIdIsNullOrderByPositionAscCreatedAtDesc(user.getId());
        }

        return tasks.stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getById(String email, Long id) {
        Task task = getOwnedTask(email, id);
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse create(String email, TaskRequest request) {
        User user = getUser(email);
        TaskList list = null;
        if (request.getListId() != null) {
            list = listRepository.findByIdAndUserId(request.getListId(), user.getId())
                    .orElseThrow(() -> new AccessDeniedException("Lista não encontrada"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.NONE)
                .dueDate(request.getDueDate())
                .reminder(request.getReminder())
                .myDay(request.isMyDay())
                .completed(request.isCompleted())
                .user(user)
                .list(list)
                .position(0)
                .build();

        task = taskRepository.save(task);

        if (request.getChecklist() != null) {
            for (TaskRequest.SubtaskRequest sr : request.getChecklist()) {
                Subtask sub = Subtask.builder()
                        .title(sr.getTitle())
                        .completed(sr.isCompleted())
                        .task(task)
                        .build();
                subtaskRepository.save(sub);
                task.getSubtasks().add(sub);
            }
        }

        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse update(String email, Long id, TaskRequest request) {
        Task task = getOwnedTask(email, id);
        User user = task.getUser();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.NONE);
        task.setDueDate(request.getDueDate());
        task.setReminder(request.getReminder());
        task.setMyDay(request.isMyDay());
        task.setCompleted(request.isCompleted());

        if (request.getListId() != null) {
            TaskList list = listRepository.findByIdAndUserId(request.getListId(), user.getId())
                    .orElseThrow(() -> new AccessDeniedException("Lista não encontrada"));
            task.setList(list);
        } else {
            task.setList(null);
        }

        if (request.getChecklist() != null) {
            subtaskRepository.deleteByTaskId(task.getId());
            task.getSubtasks().clear();
            for (TaskRequest.SubtaskRequest sr : request.getChecklist()) {
                Subtask sub = Subtask.builder()
                        .title(sr.getTitle())
                        .completed(sr.isCompleted())
                        .task(task)
                        .build();
                subtaskRepository.save(sub);
                task.getSubtasks().add(sub);
            }
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse toggleComplete(String email, Long id) {
        Task task = getOwnedTask(email, id);
        task.setCompleted(!task.isCompleted());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void delete(String email, Long id) {
        Task task = getOwnedTask(email, id);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse.SubtaskResponse createSubtask(String email, Long taskId, TaskRequest.SubtaskRequest req) {
        Task task = getOwnedTask(email, taskId);
        Subtask sub = Subtask.builder()
                .title(req.getTitle())
                .completed(req.isCompleted())
                .task(task)
                .build();
        sub = subtaskRepository.save(sub);
        return TaskResponse.SubtaskResponse.builder()
                .id(sub.getId()).title(sub.getTitle())
                .completed(sub.isCompleted()).createdAt(sub.getCreatedAt()).build();
    }

    @Transactional
    public TaskResponse.SubtaskResponse updateSubtask(String email, Long taskId, Long subtaskId, TaskRequest.SubtaskRequest req) {
        getOwnedTask(email, taskId);
        Subtask sub = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new AccessDeniedException("Subtarefa não encontrada"));
        sub.setTitle(req.getTitle());
        sub.setCompleted(req.isCompleted());
        sub = subtaskRepository.save(sub);
        return TaskResponse.SubtaskResponse.builder()
                .id(sub.getId()).title(sub.getTitle())
                .completed(sub.isCompleted()).createdAt(sub.getCreatedAt()).build();
    }

    @Transactional
    public TaskResponse.SubtaskResponse toggleSubtask(String email, Long taskId, Long subtaskId) {
        getOwnedTask(email, taskId);
        Subtask sub = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new AccessDeniedException("Subtarefa não encontrada"));
        sub.setCompleted(!sub.isCompleted());
        sub = subtaskRepository.save(sub);
        return TaskResponse.SubtaskResponse.builder()
                .id(sub.getId()).title(sub.getTitle())
                .completed(sub.isCompleted()).createdAt(sub.getCreatedAt()).build();
    }

    @Transactional
    public void deleteSubtask(String email, Long taskId, Long subtaskId) {
        getOwnedTask(email, taskId);
        Subtask sub = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new AccessDeniedException("Subtarefa não encontrada"));
        subtaskRepository.delete(sub);
    }

    private Task getOwnedTask(String email, Long taskId) {
        User user = getUser(email);
        return taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new AccessDeniedException("Tarefa não encontrada ou sem permissão"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + email));
    }
}
