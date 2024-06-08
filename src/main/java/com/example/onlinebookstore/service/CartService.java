package com.example.onlinebookstore.service;

import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.model.ShoppingCart;
import com.example.onlinebookstore.model.User;

public interface CartService {
    ShoppingCartDto save(String email, CreateCartItemRequestDto requestDto);

    ShoppingCartDto update(
            String email, Long id, UpdateCartItemRequestDto updateCartItemRequestDto);

    void deleteById(Long id);

    ShoppingCartDto getShoppingCartByUserEmail(String email);

    void createShoppingCart(User user);

    ShoppingCart findShoppingCartByUserEmail(String email);
}
