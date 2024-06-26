package com.example.onlinebookstore.service.impl;

import com.example.onlinebookstore.dto.CreateOrderRequestDto;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.dto.UpdateOrderRequestDto;
import com.example.onlinebookstore.exception.EntityNotFoundException;
import com.example.onlinebookstore.exception.OrderProcessingException;
import com.example.onlinebookstore.mapper.OrderItemMapper;
import com.example.onlinebookstore.mapper.OrderMapper;
import com.example.onlinebookstore.model.Order;
import com.example.onlinebookstore.model.OrderItem;
import com.example.onlinebookstore.model.ShoppingCart;
import com.example.onlinebookstore.model.User;
import com.example.onlinebookstore.repository.CartItemRepository;
import com.example.onlinebookstore.repository.OrderItemRepository;
import com.example.onlinebookstore.repository.OrderRepository;
import com.example.onlinebookstore.repository.ShoppingCartRepository;
import com.example.onlinebookstore.service.OrderService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderDto save(User user, CreateOrderRequestDto requestDto) {
        ShoppingCart cart = cartRepository.findShoppingCartByUserId(user.getId());
        if (cart.getCartItems().isEmpty()) {
            throw new OrderProcessingException("Cart is empty for user: " + user.getEmail());
        }
        Order order = orderMapper.cartToOrder(cart, requestDto.shippingAddress());
        order.setStatus(Order.Status.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.getOrderItems().replaceAll(i -> {
            i.setOrder(order);
            return i;
        });
        Order orderSaved = orderRepository.save(order);
        cartItemRepository.deleteAllByShoppingCartId(cart.getId());
        cart.clearCart();
        return orderMapper.toOrderDto(orderSaved);
    }

    @Override
    public OrderDto update(Long orderId, UpdateOrderRequestDto updateOrderRequestDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Order with id" + orderId + "is not found"));
        order.setStatus(Order.Status.valueOf(updateOrderRequestDto.status()));
        orderRepository.save(order);
        return orderMapper.toOrderDto(order);
    }

    @Override
    public List<OrderDto> getOrdersByUser(User user, Pageable pageable) {
        List<OrderDto> orderDtos = orderMapper.toOrdersDto(
                orderRepository.findOrdersByUserId(user.getId(), pageable));
        return orderDtos;
    }

    @Override
    public List<OrderItemDto> getOrderItems(User user, Long orderId) {
        return orderItemMapper.toOrderItemDtos(
                orderItemRepository.findOrderItemsByOrderIdAndUserId(orderId, user.getId()));
    }

    @Override
    public OrderItemDto getOrderItem(User user, Long orderId, Long itemId) {
        OrderItem orderIem = orderItemRepository
                .findByIdAndOrderIdAndUserId(itemId, orderId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "OrderItem is not found"
                                + " for itemId = " + itemId + " and "
                                + " order with orderId = " + orderId + " and "
                                + " user with email = " + user.getEmail()));
        return orderItemMapper.toOrderItemDto(orderIem);
    }
}
