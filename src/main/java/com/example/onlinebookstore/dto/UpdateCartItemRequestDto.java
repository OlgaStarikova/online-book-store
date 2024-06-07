package com.example.onlinebookstore.dto;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequestDto(
        @Min(1)
        int quantity
) {
}
