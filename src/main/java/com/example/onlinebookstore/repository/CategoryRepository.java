package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.Category;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Set<Category> findCategoriesByIdIn(Set<Long> ids);
}
