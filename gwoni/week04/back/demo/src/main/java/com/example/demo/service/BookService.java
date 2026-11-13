package com.example.demo.service;

import com.example.demo.domain.Book;
import com.example.demo.domain.Category;
import com.example.demo.dto.BookResponse;
import com.example.demo.dto.CreateBookRequest;
import com.example.demo.port.BookPort;
import com.example.demo.port.CategoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookPort bookPort;
    private final CategoryPort categoryPort;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookPort.findAllLatest().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryPort.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 카테고리입니다."));

        Book book = Book.registerNew(category, request.title(), request.description());

        return BookResponse.from(bookPort.save(book));
    }
}
