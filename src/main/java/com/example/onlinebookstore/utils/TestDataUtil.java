package com.example.onlinebookstore.utils;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.BookDtoWithoutCategoryIds;
import com.example.onlinebookstore.dto.CategoryDto;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.example.onlinebookstore.dto.CreateCategoryRequestDto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TestDataUtil {
    private static final CreateBookRequestDto createBookRequestDto = new CreateBookRequestDto()
            .setTitle("Test Title")
            .setAuthor("Test Author")
            .setIsbn("ISBN 978-5-901202-50-5")
            .setPrice(BigDecimal.valueOf(50))
            .setCoverImage("url://TestCoverImage");
    private static final BookDto bookDto = new BookDto()
            .setTitle("Test Title")
            .setAuthor("Test Author")
            .setIsbn("ISBN 978-5-901202-50-5")
            .setPrice(BigDecimal.valueOf(50))
            .setCoverImage("url://TestCoverImage");
    private static final BookDto javaBookDto = new BookDto()
            .setTitle("Mastering Java")
            .setAuthor("Jane Smith")
            .setIsbn("ISBN 978-5-901202-50-5")
            .setPrice(BigDecimal.valueOf(39.99))
            .setDescription("An advanced guide to Java programming")
            .setCoverImage("url://mastering_java_cover.jpg")
            .setCategoryIds(Collections.emptySet());
    private static final BookDto springBookDto = new BookDto()
            .setTitle("Learning Spring Boot")
            .setAuthor("John Doe")
            .setIsbn("ISBN 978-5-901202-50-5")
            .setPrice(BigDecimal.valueOf(29.99))
            .setDescription("A comprehensive guide to Spring Boot")
            .setCoverImage("url://spring_boot_cover.jpg")
            .setCategoryIds(Collections.emptySet());
    private static final BookDto hibernateBookDto = new BookDto()
            .setTitle("Learning Hibernate")
            .setAuthor("Jack Hobbit")
            .setIsbn("9781234567895")
            .setPrice(BigDecimal.valueOf(59.99))
            .setDescription("A comprehensive guide to Hibernate")
            .setCoverImage("url://hibernate_cover.jpg")
            .setCategoryIds(Collections.emptySet());
    private static final CategoryDto fantasyCategoryDto = new CategoryDto(
            "Fantasy",
            "Books about fantastic worlds");
    private static final CategoryDto horrorCategoryDto = new CategoryDto(
            "Horror",
            "Very scared books");
    private static final CategoryDto romanticCategoryDto = new CategoryDto(
            "Romantic",
            "Beautiful books with love");

    public static CreateBookRequestDto getTestCreateBookRequestDto() {
        return createBookRequestDto;
    }

    public static BookDto getTestBookDto() {
        return bookDto;
    }

    public static List<BookDto> getThreeDefaultBookDto() {
        List<BookDto> expected = new ArrayList<>();
        expected.add(javaBookDto);
        expected.add(springBookDto);
        expected.add(hibernateBookDto);
        return expected;
    }

    public static List<BookDtoWithoutCategoryIds> getThreeDefaultBookDtoWithoutCategoryIds() {
        List<BookDtoWithoutCategoryIds> expected = new ArrayList<>();
        expected.add(new BookDtoWithoutCategoryIds()
                .setTitle(javaBookDto.getTitle())
                .setAuthor(javaBookDto.getAuthor())
                .setIsbn(javaBookDto.getIsbn())
                .setPrice(javaBookDto.getPrice())
                .setDescription(javaBookDto.getDescription())
                .setCoverImage(javaBookDto.getCoverImage()));

        expected.add(new BookDtoWithoutCategoryIds()
                .setTitle(springBookDto.getTitle())
                .setAuthor(springBookDto.getAuthor())
                .setIsbn(springBookDto.getIsbn())
                .setPrice(springBookDto.getPrice())
                .setDescription(springBookDto.getDescription())
                .setCoverImage(springBookDto.getCoverImage()));

        expected.add(new BookDtoWithoutCategoryIds()
                .setTitle(hibernateBookDto.getTitle())
                .setAuthor(hibernateBookDto.getAuthor())
                .setIsbn(hibernateBookDto.getIsbn())
                .setPrice(hibernateBookDto.getPrice())
                .setDescription(hibernateBookDto.getDescription())
                .setCoverImage(hibernateBookDto.getCoverImage()));
        return expected;
    }

    public static List<CategoryDto> getThreeDefaultCategoryDto() {
        List<CategoryDto> expected = new ArrayList<>();
        expected.add(fantasyCategoryDto);
        expected.add(horrorCategoryDto);
        expected.add(romanticCategoryDto);
        return expected;
    }

    public static CategoryDto getTestFantasyCategoryDto() {
        return fantasyCategoryDto;
    }

    public static CreateCategoryRequestDto getTestCreateCategoryRequestDto() {
        return new CreateCategoryRequestDto(
                fantasyCategoryDto.name(),
                fantasyCategoryDto.description());
    }
}
