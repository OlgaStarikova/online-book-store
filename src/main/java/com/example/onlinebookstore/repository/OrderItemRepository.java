package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.OrderItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findOrderItemsByOrder_Id(Long cartId);

    Optional<OrderItem> findByIdAndOrderId(Long orderItemId, Long orderId);
}
