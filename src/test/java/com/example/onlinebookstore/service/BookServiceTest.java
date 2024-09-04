package com.example.onlinebookstore.service;

import static com.example.onlinebookstore.utils.TestDataUtil.TEST_BOOK_ID;
import static com.example.onlinebookstore.utils.TestDataUtil.getTestBook;
import static com.example.onlinebookstore.utils.TestDataUtil.getTestBookDto;
import static com.example.onlinebookstore.utils.TestDataUtil.getTestCreateBookRequestDto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.example.onlinebookstore.exception.EntityNotFoundException;
import com.example.onlinebookstore.mapper.BookMapper;
import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.repository.CategoryRepository;
import com.example.onlinebookstore.repository.book.BookRepository;
import com.example.onlinebookstore.repository.book.BookSpecificationBuilder;
import com.example.onlinebookstore.service.impl.BookServiceImpl;
import java.util.Optional;
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

    @BeforeEach
    @Sql(scripts = {
            "classpath:database/books_categories/remove_book_category_from_books_categories.sql",
            "classpath:database/books/remove_test_book_from_books_table.sql",
            "classpath:database/categories/remove_category_from_categories_table.sql"
    })
    void setUp() {
        requestDto = getTestCreateBookRequestDto();
        book = getTestBook();
        bookDto = getTestBookDto();
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

