package com.example.onlinebookstore.service;

import com.example.onlinebookstore.dto.CreateOrderRequestDto;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.dto.UpdateOrderRequestDto;
import java.util.Set;

public interface OrderService {
    OrderDto save(String email, CreateOrderRequestDto requestDto);

    OrderDto update(
            Long id, UpdateOrderRequestDto updateOrderRequestDto);

    Set<OrderDto> getOrdersByUserEmail(String email);

    Set<OrderItemDto> getOrderItems(Long id);

    OrderItemDto getOrderItem(Long id, Long itemId);
}
