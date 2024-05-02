package com.example.onlinebookstore.model;

import com.example.onlinebookstore.validation.Isbn;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@SQLDelete(sql = "UPDATE books SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    @Column(unique = true)
    @Isbn
    private String isbn;
    @Min(0)
    private BigDecimal price;
    private String description;
    private String coverImage;
    @Column(nullable = false)
    private boolean isDeleted = false;

    public Book() {
    }

    public Long getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public String getAuthor() {
        return this.author;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public String getDescription() {
        return this.description;
    }

    public String getCoverImage() {
        return this.coverImage;
    }

    public boolean isDeleted() {
        return this.isDeleted;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public void setAuthor(final String author) {
        this.author = author;
    }

    public void setIsbn(final String isbn) {
        this.isbn = isbn;
    }

    public void setPrice(final BigDecimal price) {
        this.price = price;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public void setCoverImage(final String coverImage) {
        this.coverImage = coverImage;
    }

    public void setDeleted(final boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
