package com.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskListRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String color = "#3b82f6";
}
