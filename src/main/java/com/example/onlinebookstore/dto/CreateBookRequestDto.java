package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.validation.Isbn;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateBookRequestDto {
    @NotNull
    @NotBlank
    @NotEmpty
    private String title;
    @NotNull
    @NotBlank
    @NotEmpty
    private String author;
    @NotNull
    @NotBlank
    @NotEmpty
    @Isbn
    private String isbn;
    @NotNull
    @Min(0)
    private BigDecimal price;
    private String description;
    private String coverImage;
}
