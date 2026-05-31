package com.example.onlinebookstore.mapper;

import com.example.onlinebookstore.config.MapperConfig;
import com.example.onlinebookstore.dto.UserRegistrationRequestDto;
import com.example.onlinebookstore.dto.UserResponseDto;
import com.example.onlinebookstore.model.Role;
import com.example.onlinebookstore.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    @Mapping(target = "isAdmin", expression = "java(isAdmin(user))")
    UserResponseDto toDto(User user);

    User toModel(UserRegistrationRequestDto requestDto);

    default boolean isAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(r -> r.getRole() == Role.RoleName.ADMIN);
    }
}
