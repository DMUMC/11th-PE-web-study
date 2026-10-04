package com.example.demo.service;

import com.example.demo.domain.Book;
import com.example.demo.dto.BookDto;
import com.example.demo.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public List<BookDto> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId).stream()
                .map(this::toDto)
                .toList();
    }

    public void createBook(BookDto dto){
        Book book = new Book(
                null,
                dto.getCategoryId(),
                dto.getTitle(),
                dto.getDescription(),
                true
        );
        bookRepository.save(book);
    }

    private BookDto toDto(Book book) {
        return new BookDto(
                book.getBookId(),
                book.getCategoryId(),
                book.getTitle(),
                book.getDescription(),
                book.getIsAvailable()
        );
    }
}
