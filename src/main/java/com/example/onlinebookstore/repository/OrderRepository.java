package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.Order;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Set<Order> findOrdersByUserId(Long userId);
}
