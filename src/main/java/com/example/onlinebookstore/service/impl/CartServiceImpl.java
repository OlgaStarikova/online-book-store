package com.example.onlinebookstore.service.impl;

import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.exception.EntityNotFoundException;
import com.example.onlinebookstore.mapper.CartItemMapper;
import com.example.onlinebookstore.mapper.ShoppingCartMapper;
import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.model.CartItem;
import com.example.onlinebookstore.model.ShoppingCart;
import com.example.onlinebookstore.model.User;
import com.example.onlinebookstore.repository.CartItemRepository;
import com.example.onlinebookstore.repository.ShoppingCartRepository;
import com.example.onlinebookstore.repository.book.BookRepository;
import com.example.onlinebookstore.repository.user.UserRepository;
import com.example.onlinebookstore.service.CartService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CartServiceImpl implements CartService {
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final ShoppingCartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final ShoppingCartMapper cartMapper;
    private final UserRepository userRepository;

    @Override
    public ShoppingCartDto save(String email, CreateCartItemRequestDto requestDto) {
        Book book = bookRepository.findById(requestDto.bookId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No such book with id: " + requestDto.bookId()));
        ShoppingCart shoppingCart = findShoppingCartByUserEmail(email);
        Optional<CartItem> cartItemExists = shoppingCart.getCartItems().stream()
                .filter(cartItem -> cartItem.getBook().equals(book))
                .findFirst();
        if (cartItemExists.isPresent()) {
            CartItem cartItem = cartItemExists.get();
            cartItem.setQuantity(cartItem.getQuantity() + requestDto.quantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = cartItemMapper.toCartItemModel(requestDto);
            cartItem.setShoppingCart(shoppingCart);
            cartItem.setBook(book);
            cartItemRepository.save(cartItem);
        }
        shoppingCart.setCartItems(cartItemRepository
                .findCartItemsByShoppingCart_Id(shoppingCart.getId()));
        return cartMapper.toShoppingCartDto(shoppingCart);
    }

    @Override
    public ShoppingCartDto update(String email, Long cartItemId,
                                  UpdateCartItemRequestDto requestDto) {
        ShoppingCart cart = findShoppingCartByUserEmail(email);
        CartItem cartItem = cartItemRepository.findByIdAndShoppingCartId(cartItemId, cart.getId())
                .map(item -> {
                    item.setQuantity(requestDto.quantity());
                    return item;
                })
                .orElseThrow(() -> new EntityNotFoundException(
                        "No such a cartItem with id: " + cartItemId
                ));
        cartItemRepository.save(cartItem);
        return cartMapper.toShoppingCartDto(findShoppingCartByUserEmail(email));
    }

    @Override
    public void deleteById(Long id) {
        cartItemRepository.deleteById(id);
    }

    public ShoppingCartDto getShoppingCartByUserEmail(String email) {
        return cartMapper.toShoppingCartDto(findShoppingCartByUserEmail(email));
    }

    @Override
    public void createShoppingCart(User user) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUser(user);
        cartRepository.save(shoppingCart);
    }

    private ShoppingCart findShoppingCartByUserEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User with email" + email + "is not found")).getId();
        return cartRepository.findShoppingCartByUserId(userId);
    }
}
