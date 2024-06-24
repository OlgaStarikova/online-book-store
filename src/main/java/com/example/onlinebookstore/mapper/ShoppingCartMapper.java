package com.example.onlinebookstore.mapper;

import com.example.onlinebookstore.config.MapperConfig;
import com.example.onlinebookstore.dto.CartItemDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.model.CartItem;
import com.example.onlinebookstore.model.ShoppingCart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfig.class)
public interface ShoppingCartMapper {
    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    CartItemDto toCartItemDto(CartItem cartItem);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "cartItems", target = "cartItemDtos")
    ShoppingCartDto toShoppingCartDto(ShoppingCart shoppingCart);
}
