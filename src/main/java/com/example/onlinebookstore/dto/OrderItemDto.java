package com.example.onlinebookstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "OrderItem response DTO")
public record OrderItemDto(
        Long id,
        Long bookId,
        int quantity
) {
}
