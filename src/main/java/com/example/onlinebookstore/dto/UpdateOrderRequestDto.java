package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.model.Order;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderRequestDto(
        @NotNull
        Order.Status status
) {
}
