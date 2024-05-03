package com.example.onlinebookstore.dto;

import com.example.onlinebookstore.validation.FieldMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

@FieldMatch(first = "password", second = "repeatPassword", message = "Password fields don't match")
public record UserRegistrationRequestDto(
        @NotBlank
        @Email
        String email,
        @NotBlank
        @Length(min = 8, max = 254)
        String password,
        @NotBlank
        @Length(min = 8, max = 254)
        String repeatPassword,
        @NotBlank
        String firstName,
        @NotBlank
        String lastName,
        String shippingAddress) {
}
