package com.umc.study.book;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Map<String, Object>> getBooksByCategory(long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }
}
