package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.model.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Schema(description = "Order response DTO")
public record OrderDto(
        Long id,
        Long userId,
        Set<OrderItemDto> orderItemDtos,
        LocalDateTime orderDate,
        BigDecimal total,
        Order.Status status
) {
}
