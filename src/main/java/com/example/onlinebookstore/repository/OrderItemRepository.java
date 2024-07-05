package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.OrderItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT items FROM OrderItem items "
            + "JOIN items.order orders "
            + "JOIN orders.user users "
            + "WHERE orders.id = :orderId AND users.id = :userId")
    List<OrderItem> findOrderItemsByOrderIdAndUserId(
            @Param("orderId") Long orderId,
            @Param("userId") Long userId
    );

    @Query("SELECT items FROM OrderItem items "
            + "JOIN items.order orders "
            + "JOIN orders.user users "
            + "WHERE orders.id = :orderId AND users.id = :userId AND items.id = :itemId")
    Optional<OrderItem> findByIdAndOrderIdAndUserId(
            @Param("itemId") Long itemId,
            @Param("orderId") Long orderId,
            @Param("userId") Long userId);
}
