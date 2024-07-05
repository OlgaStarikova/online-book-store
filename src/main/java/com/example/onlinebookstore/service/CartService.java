package com.example.onlinebookstore.service;

import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.model.User;

public interface CartService {
    ShoppingCartDto save(User user, CreateCartItemRequestDto requestDto);

    ShoppingCartDto update(
            User user, Long id, UpdateCartItemRequestDto updateCartItemRequestDto);

    void deleteById(Long id);

    ShoppingCartDto getShoppingCartByUser(User user);

    void createShoppingCart(User user);
}
