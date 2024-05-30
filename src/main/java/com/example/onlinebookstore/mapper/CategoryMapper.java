package com.example.onlinebookstore.mapper;

import com.example.onlinebookstore.config.MapperConfig;
import com.example.onlinebookstore.dto.CategoryDto;
import com.example.onlinebookstore.dto.CreateCategoryRequestDto;
import com.example.onlinebookstore.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface CategoryMapper {
    CategoryDto toDto(Category category);

    Category toModel(CreateCategoryRequestDto createCategoryRequestDto);

    void updateCategoryFromDto(CreateCategoryRequestDto categoryDto,
                               @MappingTarget Category category);
}
