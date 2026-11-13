package com.example.demo.port;

import com.example.demo.domain.Category;

import java.util.Optional;

public interface CategoryPort {

    Optional<Category> findById(Long categoryId);
}
