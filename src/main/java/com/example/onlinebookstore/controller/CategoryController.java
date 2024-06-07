package com.example.onlinebookstore.controller;

import com.example.onlinebookstore.dto.BookDtoWithoutCategoryIds;
import com.example.onlinebookstore.dto.CategoryDto;
import com.example.onlinebookstore.dto.CreateCategoryRequestDto;
import com.example.onlinebookstore.service.CategoryService;
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

@RestController
@Tag(name = "Category management", description = "Endpoints for managing categories")
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Create a new category", description = "Create a new category. "
            + "Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CategoryDto createCategory(@RequestBody @Valid CreateCategoryRequestDto requestDto) {
        return categoryService.save(requestDto);
    }

    @GetMapping
    @Operation(summary = "Get a list of categories", description = "Get all categories."
            + "Params(optional): page = page number, size = count of books in one page,"
            + " namefield = field for sorting. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public List<CategoryDto> getAll(@ParameterObject @PageableDefault Pageable pageable) {
        return categoryService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get the category by Id", description = "Get the category by Id"
            + "Params: id = Id of the category. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    public CategoryDto getCategoryById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete the category", description = "Delete the category by Id."
            + "Params: id = Id of the category. Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update the category", description = "Update the category by Id."
            + "Params: id = Id of the book. Available for admins.")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CategoryDto updateCategory(@PathVariable Long id,
                                  @RequestBody @Valid CreateCategoryRequestDto requestDto) {
        return categoryService.update(id, requestDto);
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "Get books in the category", description = "Get books in the category"
            + " by Id of category. "
            + "Params: id = Id of the category. Available for registered users.")
    @PreAuthorize("hasAuthority('USER')")
    List<BookDtoWithoutCategoryIds> getBooksByCategoryId(Long id) {
        return categoryService.findBooksByCategoryId(id);
    }
}
