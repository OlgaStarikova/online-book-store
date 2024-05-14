package com.example.onlinebookstore.controller;

import com.example.onlinebookstore.dto.BookDto;
import com.example.onlinebookstore.dto.BookSearchParameters;
import com.example.onlinebookstore.dto.CreateBookRequestDto;
import com.example.onlinebookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Book management", description = "Endpoints for managing books")
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get a list of books", description = "Get a list of all available books."
            + "Params(optional): page = page number, size = count of books in one page,"
            + " namefield = field for sorting. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public List<BookDto> getAll(@ParameterObject @PageableDefault Pageable pageable) {
        return bookService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get the book by Id", description = "Get the book by Id"
            + "Params: id = Id of the book. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public BookDto getBookById(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new book", description = "Create a new book. "
            + "Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public BookDto createBook(@RequestBody @Valid CreateBookRequestDto requestDto) {
        String string = requestDto.getAuthor();
        return bookService.save(requestDto);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete the book", description = "Delete the book by Id."
            + "Params: id = Id of the book. Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteBookById(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update the book", description = "Update the book by Id."
            + "Params: id = Id of the book. Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public BookDto updateBook(@PathVariable Long id,
                              @RequestBody @Valid CreateBookRequestDto requestDto) {
        return bookService.updateBook(id, requestDto);
    }

    @GetMapping("/search")
    @Operation(summary = "Search books", description = "Get a list of books by parameters"
            + "Params: String[] titles, String[] authors. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public List<BookDto> search(BookSearchParameters searchParameters,
                                @ParameterObject @PageableDefault Pageable pageable) {
        return bookService.search(searchParameters);
    }
}
