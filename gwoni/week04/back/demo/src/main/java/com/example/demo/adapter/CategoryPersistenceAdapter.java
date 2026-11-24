package com.example.demo.adapter;

import com.example.demo.adapter.entity.CategoryEntity;
import com.example.demo.adapter.repository.CategoryRepository;
import com.example.demo.domain.Category;
import com.example.demo.port.CategoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements CategoryPort {

    private final CategoryRepository categoryRepository;

    @Override
    public Optional<Category> findById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(CategoryEntity::toDomain);
    }
}
