package com.example.onlinebookstore.service;

import com.example.onlinebookstore.dto.CreateOrderRequestDto;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.dto.UpdateOrderRequestDto;
import com.example.onlinebookstore.model.User;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderDto save(User user, CreateOrderRequestDto requestDto);

    OrderDto update(
            Long id, UpdateOrderRequestDto updateOrderRequestDto);

    List<OrderDto> getOrdersByUser(User user, Pageable pageable);

    List<OrderItemDto> getOrderItems(User user, Long orderId);

    OrderItemDto getOrderItem(User user, Long orderId, Long itemId);
}
