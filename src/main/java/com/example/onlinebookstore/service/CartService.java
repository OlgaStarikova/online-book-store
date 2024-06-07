package com.example.onlinebookstore.service;

import com.example.onlinebookstore.dto.CartItemDto;
import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.model.ShoppingCart;

public interface CartService {

    CartItemDto save(String email, CreateCartItemRequestDto requestDto);

    CartItemDto update(Long id, UpdateCartItemRequestDto updateCartItemRequestDto);

    void deleteById(Long id);

    ShoppingCartDto getShoppingCartByUserEmail(String email);

    ShoppingCart findShoppingCartByUserEmail(String email);
}
