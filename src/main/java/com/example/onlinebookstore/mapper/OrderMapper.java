package com.example.onlinebookstore.mapper;

import com.example.onlinebookstore.config.MapperConfig;
import com.example.onlinebookstore.dto.OrderDto;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.model.CartItem;
import com.example.onlinebookstore.model.Order;
import com.example.onlinebookstore.model.OrderItem;
import com.example.onlinebookstore.model.ShoppingCart;
import java.math.BigDecimal;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(config = MapperConfig.class)
public interface OrderMapper {
    @Mapping(source = "book.id", target = "bookId")
    OrderItemDto toOrderItemDto(OrderItem orderItem);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderItems", target = "orderItemDtos")
    @Mapping(source = "status", target = "status", qualifiedByName = "status")
    OrderDto toOrderDto(Order order);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderItems", target = "orderItemDtos")
    List<OrderDto> toOrdersDto(List<Order> orders);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "total", source = "cart.cartItems", qualifiedByName = "total")
    @Mapping(target = "orderItems", source = "cart.cartItems",
            qualifiedByName = "orderItemFromCartItem")
    Order cartToOrder(ShoppingCart cart, String shippingAddress);

    @Named("total")
    default BigDecimal getTotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(i -> i.getBook().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Named("price")
    default BigDecimal getPrice(CartItem cartItem) {
        return cartItem.getBook().getPrice();
    }

    @Named("status")
    default String getStatus(Order.Status status) {
        return status.toString();
    }

    @Named("orderItemFromCartItem")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "price", source = "cartItem", qualifiedByName = "price")
    OrderItem toOrderItemFromCartItem(CartItem cartItem);
}
