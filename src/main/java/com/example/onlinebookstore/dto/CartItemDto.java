package com.example.onlinebookstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "CartItem response DTO")
public record CartItemDto(
        Long id,
        Long bookId,
        String bookTitle,
        int quantity
) {
}
