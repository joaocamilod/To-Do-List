package com.todo.dto;

import com.todo.model.Task;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private String priority;
    private LocalDateTime dueDate;
    private LocalDateTime reminder;
    private boolean myDay;
    private Integer position;
    private Long listId;
    private String listName;
    private List<SubtaskResponse> subtasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data @Builder
    public static class SubtaskResponse {
        private Long id;
        private String title;
        private boolean completed;
        private LocalDateTime createdAt;
    }

    public static TaskResponse from(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .priority(task.getPriority().name().toLowerCase())
                .dueDate(task.getDueDate())
                .reminder(task.getReminder())
                .myDay(task.isMyDay())
                .position(task.getPosition())
                .listId(task.getList() != null ? task.getList().getId() : null)
                .listName(task.getList() != null ? task.getList().getName() : null)
                .subtasks(task.getSubtasks().stream().map(s -> SubtaskResponse.builder()
                        .id(s.getId())
                        .title(s.getTitle())
                        .completed(s.isCompleted())
                        .createdAt(s.getCreatedAt())
                        .build()).toList())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
