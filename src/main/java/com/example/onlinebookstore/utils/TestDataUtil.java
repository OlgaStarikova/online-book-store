package com.example.onlinebookstore.utils;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.CategoryDto;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.example.onlinebookstore.dto.CreateCategoryRequestDto;
import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.model.Category;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

public class TestDataUtil {
    public static final Long TEST_BOOK_ID = 1L;
    public static final String TEST_BOOK_TITLE = "Test Book 1";
    public static final String TEST_BOOK_AUTHOR = "Test Author 1";
    public static final String TEST_BOOK_ISBN = "ISBN 978-5-901202-50-5";
    public static final String TEST_BOOK_ISBN_NEW = "ISBN 978-5-901202-50-6";
    public static final BigDecimal TEST_BOOK_PRICE = BigDecimal.valueOf(20);
    public static final String TEST_BOOK_DESCRIPTION = "Test Description";
    public static final String TEST_BOOK_COVER_URL = "url://testbook_cover.jpg";
    public static final Long TEST_CATEGORY_ID = 1L;
    public static final String TEST_CATEGORY_NAME = "Test category";
    public static final Set<Long> CATEGORY_IDS = new HashSet<>();
    private static CreateBookRequestDto createBookRequestDto = new CreateBookRequestDto()
            .setTitle(TEST_BOOK_TITLE)
            .setAuthor(TEST_BOOK_AUTHOR)
            .setIsbn(TEST_BOOK_ISBN)
            .setPrice(TEST_BOOK_PRICE)
            .setDescription(TEST_BOOK_DESCRIPTION)
            .setCoverImage(TEST_BOOK_COVER_URL);

    private static CreateBookRequestDto createBookRequestDtoNew = new CreateBookRequestDto()
            .setTitle(TEST_BOOK_TITLE)
            .setAuthor(TEST_BOOK_AUTHOR)
            .setIsbn(TEST_BOOK_ISBN_NEW)
            .setPrice(TEST_BOOK_PRICE)
            .setDescription(TEST_BOOK_DESCRIPTION)
            .setCoverImage(TEST_BOOK_COVER_URL);
    private static BookDto bookDto = new BookDto()
            .setTitle(TEST_BOOK_TITLE)
            .setAuthor(TEST_BOOK_AUTHOR)
            .setIsbn(TEST_BOOK_ISBN)
            .setPrice(TEST_BOOK_PRICE)
            .setDescription(TEST_BOOK_DESCRIPTION)
            .setCoverImage(TEST_BOOK_COVER_URL)
            .setCategoryIds(CATEGORY_IDS);

    private static BookDto bookDtoNew = new BookDto()
            .setTitle(TEST_BOOK_TITLE)
            .setAuthor(TEST_BOOK_AUTHOR)
            .setIsbn(TEST_BOOK_ISBN_NEW)
            .setPrice(TEST_BOOK_PRICE)
            .setDescription(TEST_BOOK_DESCRIPTION)
            .setCoverImage(TEST_BOOK_COVER_URL)
            .setCategoryIds(CATEGORY_IDS);

    private static final Category category = new Category()
            .setId(TEST_CATEGORY_ID)
            .setName(TEST_CATEGORY_NAME)
            .setDescription(TEST_BOOK_DESCRIPTION);

    private static final Set<Category> CATEGORIES = new HashSet<>();

    private static Book book = new Book()
            .setTitle(TEST_BOOK_TITLE)
            .setAuthor(TEST_BOOK_AUTHOR)
            .setIsbn(TEST_BOOK_ISBN)
            .setPrice(TEST_BOOK_PRICE)
            .setDescription(TEST_BOOK_DESCRIPTION)
            .setCoverImage(TEST_BOOK_COVER_URL)
            .setCategories(CATEGORIES);

    private static CategoryDto categoryDto = new CategoryDto(
            TEST_CATEGORY_NAME,
            TEST_BOOK_DESCRIPTION);

    private static CreateCategoryRequestDto categoryRequestDto = new CreateCategoryRequestDto(
            TEST_CATEGORY_NAME,
            TEST_BOOK_DESCRIPTION);

    public static CreateBookRequestDto getTestCreateBookRequestDto() {
        return createBookRequestDto;
    }

    public static CreateBookRequestDto getTestCreateBookRequestDtoNew() {
        return createBookRequestDtoNew;
    }

    public static BookDto getTestBookDto() {
        return bookDto;
    }

    public static BookDto getTestBookDtoNew() {
        return bookDtoNew;
    }

    public static Book getTestBook() {
        return book;
    }

    public static Category getTestCategory() {
        return category;
    }

    public static CategoryDto getTestCategoryDto() {
        return categoryDto;
    }

    public static CreateCategoryRequestDto getTestCategoryRequestDto() {
        return categoryRequestDto;
    }
}
