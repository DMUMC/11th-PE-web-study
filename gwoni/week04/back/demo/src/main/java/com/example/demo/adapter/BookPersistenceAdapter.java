package com.example.demo.adapter;

import com.example.demo.adapter.entity.BookEntity;
import com.example.demo.adapter.entity.CategoryEntity;
import com.example.demo.adapter.repository.BookRepository;
import com.example.demo.adapter.repository.CategoryRepository;
import com.example.demo.domain.Book;
import com.example.demo.port.BookPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookPersistenceAdapter implements BookPort {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<Book> findAllLatest() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookEntity::toDomain)
                .toList();
    }

    @Override
    public Book save(Book book) {
        CategoryEntity category = categoryRepository.getReferenceById(book.getCategory().getCategoryId());
        BookEntity saved = bookRepository.save(BookEntity.from(book, category));

        return new Book(
                saved.getBookId(),
                book.getCategory(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getIsAvailable()
        );
    }
}
