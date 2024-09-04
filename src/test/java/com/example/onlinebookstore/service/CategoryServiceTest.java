package com.example.onlinebookstore.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.onlinebookstore.dto.CategoryDto;
import com.example.onlinebookstore.dto.CreateCategoryRequestDto;
import com.example.onlinebookstore.mapper.CategoryMapper;
import com.example.onlinebookstore.model.Category;
import com.example.onlinebookstore.repository.CategoryRepository;
import com.example.onlinebookstore.service.impl.CategoryServiceImpl;
import com.example.onlinebookstore.utils.TestDataUtil;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {
    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;
    private Category category;
    private CategoryDto categoryDto;
    private CreateCategoryRequestDto createCategoryRequestDto;

    @BeforeEach
    void setUp() {
        category = TestDataUtil.getTestCategory();
        categoryDto = TestDataUtil.getTestCategoryDto();
        createCategoryRequestDto = TestDataUtil.getTestCategoryRequestDto();
    }

    @Test
    @DisplayName("""
            Test findAll method, valid result
            """)
    public void findAll_validParameters_ok() {
        List<Category> categories = List.of(category);
        List<CategoryDto> expected = List.of(categoryDto);
        Pageable pageable = PageRequest.of(0, 1);
        Page<Category> pageCategory = new PageImpl<>(categories, pageable, 1);

        when(categoryRepository.findAll(pageable)).thenReturn(pageCategory);
        when(categoryMapper.toDto(categories.get(0))).thenReturn(expected.get(0));

        List<CategoryDto> actual = categoryService.findAll(pageable);
        Assertions.assertEquals(expected.size(), actual.size());
    }

    @Test
    @DisplayName("""
            Test getById method, valid result
            """)
    public void getById_validParameters_ok() {
        CategoryDto expected = categoryDto;
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(categoryMapper.toDto(category)).thenReturn(categoryDto);
        CategoryDto actual = categoryService.getById(anyLong());
        assertEquals(actual, expected);
    }

    @Test
    @DisplayName("""
            Test save method, valid result
            """)
    public void save_validParameters_ok() {
        CategoryDto expected = categoryDto;

        when(categoryMapper.toModel(createCategoryRequestDto)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toDto(category)).thenReturn(expected);

        CategoryDto actual = categoryService.save(createCategoryRequestDto);
        assertEquals(actual, expected);
    }

    @Test
    @DisplayName("""
            Test update method, valid result
            """)
    public void update_validParameters_ok() {
        Long testId = TestDataUtil.TEST_CATEGORY_ID;
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));

        categoryService.update(testId, createCategoryRequestDto);

        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    @DisplayName("""
            Test deleteById method, valid result
            """)
    public void deleteById_validParameters_ok() {
        Long testId = TestDataUtil.TEST_CATEGORY_ID;
        categoryService.deleteById(testId);
        verify(categoryRepository, times(1)).deleteById(testId);
    }
}
