package com.example.onlinebookstore.controller;

import com.example.onlinebookstore.dto.CreateCartItemRequestDto;
import com.example.onlinebookstore.dto.ShoppingCartDto;
import com.example.onlinebookstore.dto.UpdateCartItemRequestDto;
import com.example.onlinebookstore.model.User;
import com.example.onlinebookstore.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "ShoppingCart management", description = "Endpoints for managing shopping carts")
@RequestMapping("/cart")
@RequiredArgsConstructor
public class ShoppingCartController {
    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get the shopping cart ", description = "Get the Shopping cart "
            + "with cart items .Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public ShoppingCartDto getShoppingCart(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return cartService.getShoppingCartByUser(user);
    }

    @PostMapping
    @Operation(summary = "Create a new cartItem", description = "Create a new cartItem. "
            + "Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public ShoppingCartDto createCart(Authentication authentication,
                                      @RequestBody @Valid CreateCartItemRequestDto requestDto) {
        User user = (User) authentication.getPrincipal();
        return cartService.save(user, requestDto);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/items/{id}")
    @Operation(summary = "Delete the cart item", description = "Delete the cart item by Id."
            + "Params: id = Id of the cart item. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public void deleteCartItem(@PathVariable Long id) {
        cartService.deleteById(id);
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update the cart item", description = "Update the cart item by Id."
            + "Params: id = Id of the cart item. Available for users.")
    @PreAuthorize("hasAuthority('USER')")
    public ShoppingCartDto updateCartItem(Authentication authentication,
                                          @PathVariable Long id,
                                          @RequestBody @Valid
                                          UpdateCartItemRequestDto requestDto) {
        User user = (User) authentication.getPrincipal();
        return cartService.update(user, id, requestDto);
    }
}
