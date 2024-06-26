package com.example.onlinebookstore.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateOrderRequestDto(
        @NotBlank
        String status
) {
}
