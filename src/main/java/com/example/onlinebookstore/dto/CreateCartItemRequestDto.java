package com.example.onlinebookstore.dto;

import jakarta.validation.constraints.Positive;

public record CreateCartItemRequestDto(
        @Positive
        Long bookId,
        @Positive
        int quantity
) {
}
