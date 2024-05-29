package com.example.onlinebookstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Category response DTO")
public record CategoryDto(
        @NotBlank
        String name,
        String description
) {
}
