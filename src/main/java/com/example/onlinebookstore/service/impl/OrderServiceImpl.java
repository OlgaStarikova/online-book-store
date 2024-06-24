package com.example.onlinebookstore.service.impl;

import com.example.onlinebookstore.dto.CreateOrderRequestDto;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.dto.UpdateOrderRequestDto;
import com.example.onlinebookstore.mapper.OrderItemMapper;
import com.example.onlinebookstore.mapper.OrderMapper;
import com.example.onlinebookstore.model.Order;
import com.example.onlinebookstore.model.OrderItem;
import com.example.onlinebookstore.model.User;
import com.example.onlinebookstore.repository.OrderItemRepository;
import com.example.onlinebookstore.repository.OrderRepository;
import com.example.onlinebookstore.repository.ShoppingCartRepository;
import com.example.onlinebookstore.repository.user.UserRepository;
import com.example.onlinebookstore.service.CartService;
import com.example.onlinebookstore.service.OrderService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserRepository userRepository;
    private final ShoppingCartRepository cartRepository;
    private final CartService cartService;

    @Override
    public OrderDto save(String email, CreateOrderRequestDto requestDto) {
        Order order = new Order();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User with email" + email + "is not found"));
        order.setUser(user);
        order.setShippingAddress(requestDto.shippingAddress());
        order.setStatus(Order.Status.PENDING);
        order.setTotal(BigDecimal.valueOf(0.00));
        order.setOrderDate(LocalDateTime.now());
        Order orderSaved = orderRepository.save(order);
        Order orderWithItems = createOrderItems(orderSaved, user);
        orderWithItems.setTotal(countTotalSumOrder(orderWithItems));
        orderRepository.save(orderWithItems);
        cartRepository.delete(cartRepository
                .findShoppingCartByUserId(user.getId()));
        cartService.createShoppingCart(user);
        return orderMapper.toOrderDto(orderWithItems);
    }

    private Order createOrderItems(Order order, User user) {
        Set<OrderItem> orderItems = cartRepository
                .findShoppingCartByUserId(user.getId())
                .getCartItems()
                .stream()
                .map(cartItem -> {
                    OrderItem orderItem =
                            orderItemMapper.toOrderItemFromCartItem(cartItem);
                    orderItem.setOrder(order);
                    orderItem.setPrice(cartItem.getBook().getPrice());
                    return orderItem;
                })
                .collect(Collectors.toSet());
        orderItemRepository.saveAll(orderItems);
        order.setOrderItems(orderItems);
        return order;
    }

    private BigDecimal countTotalSumOrder(Order order) {
        BigDecimal total = order.getOrderItems()
                .stream()
                .map(o -> {
                    return o.getPrice()
                            .multiply(new BigDecimal(o.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total;
    }

    @Override
    public OrderDto update(Long id, UpdateOrderRequestDto updateOrderRequestDto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Order with id" + id + "is not found"));
        order.setStatus(updateOrderRequestDto.status());
        orderRepository.save(order);
        return orderMapper.toOrderDto(order);
    }

    @Override
    public Set<OrderDto> getOrdersByUserEmail(String email) {
        return orderMapper.toOrdersDto(findOrdersByUserEmail(email));
    }

    @Override
    public Set<OrderItemDto> getOrderItems(Long id) {
        return orderItemMapper.toOrderItemDtos(
                orderItemRepository.findOrderItemsByOrder_Id(id));
    }

    @Override
    public OrderItemDto getOrderItem(Long orderId, Long itemId) {
        return orderItemMapper.toOrderItemDto(
                orderItemRepository.findByIdAndOrderId(itemId, orderId)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "OrderItem with id = " + itemId + "is not found"
                                        + " for order with id = " + orderId))
        );
    }

    private Set<Order> findOrdersByUserEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User with email" + email + "is not found")).getId();
        return orderRepository.findOrdersByUserId(userId);
    }
}
