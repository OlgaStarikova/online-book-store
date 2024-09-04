package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.validation.Isbn;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.Set;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class CreateBookRequestDto {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    @Isbn
    private String isbn;
    @Min(0)
    private BigDecimal price;
    private String description;
    private String coverImage;
    private Set<Long> categoryIds;
}
