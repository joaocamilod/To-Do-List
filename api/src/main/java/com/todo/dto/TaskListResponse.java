package com.todo.dto;

import com.todo.model.TaskList;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class TaskListResponse {
    private Long id;
    private String name;
    private String color;
    private LocalDateTime createdAt;

    public static TaskListResponse from(TaskList list) {
        return TaskListResponse.builder()
                .id(list.getId())
                .name(list.getName())
                .color(list.getColor())
                .createdAt(list.getCreatedAt())
                .build();
    }
}
