package com.todo.dto;

import com.todo.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    private Long listId;

    private LocalDateTime dueDate;
    private LocalDateTime reminder;

    private Task.Priority priority = Task.Priority.NONE;

    private boolean myDay = false;
    private boolean completed = false;

    private List<SubtaskRequest> checklist;

    @Data
    public static class SubtaskRequest {
        @NotBlank
        @Size(max = 200)
        private String title;
        private boolean completed = false;
    }
}
