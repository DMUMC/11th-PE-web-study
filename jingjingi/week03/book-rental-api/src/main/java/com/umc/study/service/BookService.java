package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Map<String, Object>> getBooksByCategory(long categoryId) {
        if (categoryId <= 0) {
            throw new IllegalArgumentException("categoryId는 1 이상의 숫자여야 합니다.");
        }
        return bookRepository.findByCategoryId(categoryId);
    }
}
