package com.example.onlinebookstore.repository;

import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.repository.book.BookRepository;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Test
    @Sql(scripts = {
            "classpath:database/books/add_test_book_to_books_table.sql",
            "classpath:database/categories/add_category_to_categories_table.sql",
            "classpath:database/books_categories/"
                    + "add_book_category_to_books_categories_table.sql"
    }, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = {
            "classpath:database/books_categories/remove_book_category_from_books_categories.sql",
            "classpath:database/books/remove_test_book_from_books_table.sql",
            "classpath:database/categories/remove_category_from_categories_table.sql"
    }, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    @DisplayName("""
            Find all books by category id
            """)
    void findAllByCategoryId_ReturnOneBookById() {
        List<Book> allByCategoryId = bookRepository.findBooksByCategoriesId(1L);
        Assertions.assertEquals(1, allByCategoryId.size());

    }
}
