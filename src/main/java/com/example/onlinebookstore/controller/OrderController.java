package com.example.onlinebookstore.controller;

import com.example.onlinebookstore.dto.CreateOrderRequestDto;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.dto.UpdateOrderRequestDto;
import com.example.onlinebookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Order management", description = "Endpoints for managing orders")
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get orders for current user ", description = "Get orders"
            + "with order items. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public Set<OrderDto> getOrders() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderService.getOrdersByUserEmail(userName);
    }

    @PostMapping
    @Operation(summary = "Create a new Order", description = "Create a new order. "
            + "Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public OrderDto createOrder(@RequestBody @Valid CreateOrderRequestDto requestDto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderService.save(userName, requestDto);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update the order status", description = "Update the order by Id."
            + "Params: id = Id of the order. Available for users.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderDto updateOrderStatus(@PathVariable Long id,
                                      @RequestBody @Valid UpdateOrderRequestDto requestDto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderService.update(id, requestDto);
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "Get order items for current order ", description = "Get order items"
            + "for current order. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public Set<OrderItemDto> getOrderItems(@PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    @GetMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Get order items for current order ", description = "Get order items"
            + "for current order. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public OrderItemDto getOrderItem(@PathVariable Long orderId, @PathVariable Long itemId) {
        return orderService.getOrderItem(orderId, itemId);
    }
}
