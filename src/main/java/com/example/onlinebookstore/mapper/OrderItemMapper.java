package com.example.onlinebookstore.mapper;

import com.example.onlinebookstore.config.MapperConfig;
import com.example.onlinebookstore.dto.OrderItemDto;
import com.example.onlinebookstore.model.CartItem;
import com.example.onlinebookstore.model.OrderItem;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfig.class)
public interface OrderItemMapper {
    @Mapping(source = "book.id", target = "bookId")
    OrderItemDto toOrderItemDto(OrderItem orderItem);

    @Mapping(source = "book.id", target = "bookId")
    List<OrderItemDto> toOrderItemDtos(List<OrderItem> orderItems);

    @Mapping(target = "id", ignore = true)
    OrderItem toOrderItemFromCartItem(CartItem cartItem);
}
