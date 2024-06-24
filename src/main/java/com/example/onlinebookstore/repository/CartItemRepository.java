package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.CartItem;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Set<CartItem> findCartItemsByShoppingCart_Id(Long cartId);

    Optional<CartItem> findByIdAndShoppingCartId(Long cartItemId, Long cartId);
}
