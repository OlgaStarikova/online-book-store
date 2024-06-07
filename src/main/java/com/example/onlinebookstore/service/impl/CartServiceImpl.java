package com.example.onlinebookstore.service.impl;

import com.example.onlinebookstore.dto.CartItemDto;
import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.exception.EntityNotFoundException;
import com.example.onlinebookstore.mapper.ShoppingCartMapper;
import com.example.onlinebookstore.model.CartItem;
import com.example.onlinebookstore.model.ShoppingCart;
import com.example.onlinebookstore.repository.CartItemRepository;
import com.example.onlinebookstore.repository.ShoppingCartRepository;
import com.example.onlinebookstore.repository.book.BookRepository;
import com.example.onlinebookstore.repository.user.UserRepository;
import com.example.onlinebookstore.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CartServiceImpl implements CartService {
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final ShoppingCartMapper cartMapper;
    private final UserRepository userRepository;

    @Override
    public CartItemDto save(String email, CreateCartItemRequestDto requestDto) {
        CartItem cartItem = cartMapper.toCartItemModel(requestDto);
        cartItem.setShoppingCart(findShoppingCartByUserEmail(email));
        cartItem.setBook(bookRepository.findById(requestDto.bookId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No such book with id: " + requestDto.bookId())));
        return cartMapper.toCartItemDto(cartItemRepository.save(cartItem));
    }

    @Override
    public CartItemDto update(Long id, UpdateCartItemRequestDto requestDto) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No such a cartItem with id: " + id
                ));
        cartMapper.updateCartItemFromDto(requestDto, cartItem);
        return cartMapper.toCartItemDto(cartItemRepository.save(cartItem));
    }

    @Override
    public void deleteById(Long id) {
        cartItemRepository.deleteById(id);
    }

    public ShoppingCartDto getShoppingCartByUserEmail(String email) {
        return cartMapper.toShoppingCartDto(findShoppingCartByUserEmail(email));
    }

    @Override
    public ShoppingCart findShoppingCartByUserEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User with email" + email + "is not found")).getId();
        return shoppingCartRepository.findShoppingCartByUserId(userId);
    }
}
