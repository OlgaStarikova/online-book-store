package com.example.onlinebookstore.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.example.onlinebookstore.exception.EntityNotFoundException;
import com.example.onlinebookstore.mapper.BookMapper;
import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.model.Category;
import com.example.onlinebookstore.repository.CategoryRepository;
import com.example.onlinebookstore.repository.book.BookRepository;
import com.example.onlinebookstore.repository.book.BookSpecificationBuilder;
import com.example.onlinebookstore.service.impl.BookServiceImpl;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.jdbc.Sql;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {
    private static final Long TEST_BOOK_ID = 1L;
    private static final String TEST_BOOK_TITLE = "Test Book 1";
    private static final String TEST_BOOK_AUTHOR = "Test Author 1";
    private static final String TEST_BOOK_ISBN = "978-1-52910-949-1";
    private static final BigDecimal TEST_BOOK_PRICE = BigDecimal.valueOf(20);
    private static final String TEST_BOOK_DESCRIPTION = "Test Description";
    private static final String TEST_BOOK_COVER_URL = "'url://testbook_cover.jpg'";
    private static final Long TEST_CATEGORY_ID = 1L;
    private static final String TEST_CATEGORY_NAME = "Test category";
    @Mock
    private BookRepository bookRepository;

    @Mock
    private BookMapper bookMapper;

    @Mock
    private BookSpecificationBuilder bookSpecificationBuilder;

    @InjectMocks
    private BookServiceImpl bookService;

    @Mock
    private CategoryRepository categoryRepository;

    private CreateBookRequestDto requestDto;
    private Book book;
    private BookDto bookDto;
    private Set<Category> categories = new HashSet<>();
    private Set<Long> categoryIds = new HashSet<>();

    @BeforeEach
    @Sql(scripts = {
            "classpath:database/books_categories/remove_book_category_from_books_categories.sql",
            "classpath:database/books/remove_test_book_from_books_table.sql",
            "classpath:database/categories/remove_category_from_categories_table.sql"
    })
    void setUp() {
        categoryIds.add(TEST_CATEGORY_ID);
        requestDto = new CreateBookRequestDto()
                .setTitle(TEST_BOOK_TITLE)
                .setAuthor(TEST_BOOK_AUTHOR)
                .setIsbn(TEST_BOOK_ISBN)
                .setPrice(TEST_BOOK_PRICE)
                .setDescription(TEST_BOOK_DESCRIPTION)
                .setCoverImage(TEST_BOOK_COVER_URL)
                .setCategoryIds(categoryIds);

        Category category = new Category();
        category.setId(TEST_CATEGORY_ID);
        category.setName(TEST_CATEGORY_NAME);
        categories.add(category);

        book = new Book();
        book.setId(TEST_BOOK_ID);
        book.setTitle(requestDto.getTitle());
        book.setAuthor(requestDto.getAuthor());
        book.setIsbn(requestDto.getIsbn());
        book.setPrice(requestDto.getPrice());
        book.setDescription(requestDto.getDescription());
        book.setCoverImage(requestDto.getCoverImage());
        book.setCategories(categories);

        bookDto = new BookDto()
                .setTitle(requestDto.getTitle())
                .setAuthor(requestDto.getAuthor())
                .setIsbn(requestDto.getIsbn())
                .setPrice(requestDto.getPrice())
                .setDescription(requestDto.getDescription())
                .setCoverImage(requestDto.getCoverImage())
                .setCategoryIds(requestDto.getCategoryIds());
    }

    @Test
    @DisplayName("""
            Test save method, valid result
            """)
    public void save_validParameters_ok() {
        BookDto expected = bookDto;

        when(bookMapper.toModel(requestDto)).thenReturn(book);
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toDto(book)).thenReturn(expected);

        BookDto actual = bookService.save(requestDto);
        Assertions.assertNotNull(actual);
        assertEquals(actual, expected);
    }

    @Test
    @DisplayName("""
            Test save method when input parameters is empty, should throw exception
            """)
    public void save_emptyInputParameters_shouldThrowException() {
        CreateBookRequestDto requestDto = null;
        String expected = "Input parameters can't be null";

        RuntimeException thrown = Assertions.assertThrows(RuntimeException.class,
                () -> bookService.save(requestDto));

        assertTrue(thrown.getMessage().contains(expected));
    }

    @Test
    @DisplayName("""
            Test method findBookById ,valid result
            """)
    public void findBookById_validParameters_ok() {
        BookDto expected = bookDto;
        when(bookRepository.findById(TEST_BOOK_ID)).thenReturn(Optional.of(book));
        when(bookMapper.toDto(book)).thenReturn(bookDto);

        BookDto actual = bookService.findById(TEST_BOOK_ID);

        assertEquals(actual, expected);
    }

    @Test
    @DisplayName("""
            Test deleteById method, valid result
            """)
    public void deleteById_validParameters_ok() {
        bookService.deleteBook(TEST_BOOK_ID);

        EntityNotFoundException exception = Assertions.assertThrows(EntityNotFoundException.class,
                () -> bookService.findById(TEST_BOOK_ID));

        String expected = "Can't find book by id " + TEST_BOOK_ID;
        String actual = exception.getMessage();

        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("""
            Test updateBookById method, valid result
            """)
    public void updateBookById_validParameters_ok() {
        when(bookMapper.toModel(requestDto)).thenReturn(book);
        when(bookRepository.findById(TEST_BOOK_ID)).thenReturn(Optional.of(book));
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toDto(book)).thenReturn(bookDto);

        BookDto expected = bookDto;
        BookDto actual = bookService.updateBook(TEST_BOOK_ID, requestDto);

        assertEquals(expected, actual);
    }
}

