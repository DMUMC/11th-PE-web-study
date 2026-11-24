package com.umc.study.week.service;

import com.umc.study.week.dto.BookResponse;
import com.umc.study.week.dto.CreateBookRequest;
import com.umc.study.week.entity.Book;
import com.umc.study.week.entity.Category;
import com.umc.study.week.repository.BookRepository;
import com.umc.study.week.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllWithCategoryOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponse> searchBooks(String keyword) {
        return bookRepository.findByTitleContainingWithCategoryOrderByBookIdDesc(keyword).stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        if (bookRepository.existsByTitle(request.title())) {
            throw new IllegalStateException("이미 등록된 도서 제목입니다: " + request.title());
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 카테고리입니다. categoryId: " + request.categoryId()));

        Book book = new Book(category, request.title(), request.description());
        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new NoSuchElementException("존재하지 않는 카테고리입니다. categoryId: " + categoryId);
        }

        return bookRepository.findByCategory_CategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }
}
