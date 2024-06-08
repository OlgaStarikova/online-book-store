package com.example.onlinebookstore.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateCartItemRequestDto(
        @NotNull
        Long bookId,
        @Positive
        int quantity
) {
}
