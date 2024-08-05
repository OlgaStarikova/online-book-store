package com.example.onlinebookstore.controller;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;
import javax.sql.DataSource;
import lombok.SneakyThrows;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.shaded.org.apache.commons.lang3.builder.EqualsBuilder;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BookControllerTest {
    protected static MockMvc mockMvc;
    private static final Long TEST_BOOK_ID = 1L;
    private static final String TEST_BOOK_TITLE = "Test Book 1";
    private static final String TEST_BOOK_AUTHOR = "Test Author 1";
    private static final String TEST_BOOK_ISBN = "ISBN 978-5-901202-50-5";
    private static final String TEST_BOOK_ISBN_NEW = "ISBN 978-5-901202-50-6";
    private static final BigDecimal TEST_BOOK_PRICE = BigDecimal.valueOf(20);
    private static final String TEST_BOOK_DESCRIPTION = "Test Description";
    private static final String TEST_BOOK_COVER_URL = "url://testbook_cover.jpg";
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void beforeEach(
            @Autowired DataSource dataSource,
            @Autowired WebApplicationContext webApplicationContext
    ) throws SQLException {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        tearDown(dataSource);
        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(true);
            ScriptUtils.executeSqlScript(
                    connection,
                    new ClassPathResource("database/books/add_three_books_to_books_table.sql")
            );
        }
    }

    @AfterEach
    public void afterEach(
            @Autowired DataSource dataSource
    ) {
        tearDown(dataSource);
    }

    @WithMockUser(username = "Admin", authorities = {"ADMIN"})
    @Test
    @DisplayName("""
            Test save method, valid result
            """)
    public void save_validRequestDto_ok() throws Exception {
        CreateBookRequestDto requestDto = new CreateBookRequestDto();
        requestDto.setTitle(TEST_BOOK_TITLE);
        requestDto.setAuthor(TEST_BOOK_AUTHOR);
        requestDto.setIsbn(TEST_BOOK_ISBN_NEW);
        requestDto.setPrice(TEST_BOOK_PRICE);
        requestDto.setDescription(TEST_BOOK_DESCRIPTION);
        requestDto.setCoverImage(TEST_BOOK_COVER_URL);
        Set<Long> categoryIds = new HashSet<>();
        requestDto.setCategoryIds(categoryIds);

        BookDto expected = new BookDto();
        expected.setCoverImage(TEST_BOOK_COVER_URL);
        expected.setAuthor(TEST_BOOK_AUTHOR);
        expected.setTitle(TEST_BOOK_TITLE);
        expected.setPrice(TEST_BOOK_PRICE);
        expected.setIsbn(TEST_BOOK_ISBN_NEW);
        expected.setDescription(TEST_BOOK_DESCRIPTION);
        expected.setCategoryIds(categoryIds);

        String jsonRequest = objectMapper.writeValueAsString(requestDto);

        MvcResult result = mockMvc.perform(
                        post("/books")
                                .content(jsonRequest)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();
        BookDto actual = objectMapper.readValue(result.getResponse().getContentAsString(),
                BookDto.class);
        Assertions.assertNotNull(actual);
        Assertions.assertEquals(expected, actual);
    }

    @WithMockUser(username = "User", authorities = {"USER"})
    @Test
    @DisplayName("Find All books")
    public void findAllBooks_ValidRequest_Success() throws Exception {
        //Given
        MvcResult result = mockMvc.perform(
                        get("/books")
                                .contentType(MediaType.APPLICATION_JSON)
                ).andExpect(status().isOk())
                .andReturn();

        //When
        BookDto[] actual = objectMapper
                .readValue(result.getResponse().getContentAsByteArray(), BookDto[].class);
        //Then
        Assertions.assertEquals(3, actual.length);
    }

    @WithMockUser(username = "User", authorities = {"USER"})
    @Test
    @DisplayName("Find book by Id")
    public void findBookById_ValidRequest_Success() throws Exception {
        //Given
        BookDto expected = new BookDto();
        expected.setCoverImage(TEST_BOOK_COVER_URL);
        expected.setAuthor(TEST_BOOK_AUTHOR);
        expected.setTitle(TEST_BOOK_TITLE);
        expected.setPrice(TEST_BOOK_PRICE);
        expected.setIsbn(TEST_BOOK_ISBN);
        expected.setDescription(TEST_BOOK_DESCRIPTION);
        Set<Long> categoryIds = new HashSet<>();
        expected.setCategoryIds(categoryIds);

        MvcResult result = mockMvc.perform(
                        get("/books/" + TEST_BOOK_ID)
                                .contentType(MediaType.APPLICATION_JSON)
                ).andExpect(status().isOk())
                .andReturn();
        //When
        BookDto actual = objectMapper
                .readValue(result.getResponse().getContentAsByteArray(), BookDto.class);
        //Then
        Assertions.assertEquals(expected, actual);
    }

    @WithMockUser(username = "Admin", authorities = {"ADMIN"})
    @Test
    @DisplayName("Delete existing book")
    public void delete_anyRequest_Success() throws Exception {
        MvcResult result = mockMvc.perform(
                        delete("/books/" + TEST_BOOK_ID)
                                .contentType(MediaType.APPLICATION_JSON)
                ).andExpect(status().isNoContent())
                .andReturn();
    }

    @WithMockUser(username = "User", authorities = {"USER"})
    @Test
    @DisplayName("Search existing book")
    public void search_validRequest_Success() throws Exception {
        //Given
        BookDto expectedBook = new BookDto();
        expectedBook.setCoverImage(TEST_BOOK_COVER_URL);
        expectedBook.setAuthor(TEST_BOOK_AUTHOR);
        expectedBook.setTitle(TEST_BOOK_TITLE);
        expectedBook.setPrice(TEST_BOOK_PRICE);
        expectedBook.setIsbn(TEST_BOOK_ISBN);
        expectedBook.setDescription(TEST_BOOK_DESCRIPTION);
        Set<Long> categoryIds = new HashSet<>();
        expectedBook.setCategoryIds(categoryIds);
        BookDto[] expected = new BookDto[]{expectedBook};
        MvcResult result = mockMvc.perform(
                        get("/books/search")
                                .param("titles", TEST_BOOK_TITLE)
                                .contentType(MediaType.APPLICATION_JSON)
                ).andExpect(status().isOk())
                .andReturn();
        //When
        BookDto[] actual = objectMapper
                .readValue(result.getResponse().getContentAsString(), BookDto[].class);
        //Then
        EqualsBuilder.reflectionEquals(expected, actual, "id");
    }

    @SneakyThrows
    private static void tearDown(DataSource dataSource) {
        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(true);
            ScriptUtils.executeSqlScript(
                    connection,
                    new ClassPathResource("database/books/remove_all_books_from_books_table.sql")
            );
        }
    }
}
