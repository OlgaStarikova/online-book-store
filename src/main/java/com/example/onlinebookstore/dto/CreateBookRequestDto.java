package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.validation.Isbn;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateBookRequestDto {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    @Isbn
    private String isbn;
    @NotNull
    @Min(0)
    private BigDecimal price;
    private String description;
    private String coverImage;
}
