package com.example.onlinebookstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateCartItemRequestDto(
        @NotNull
        Long bookId,
        @Min(1)
        int quantity
) {
}
