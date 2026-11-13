package com.example.demo.adapter.entity;

import com.example.demo.domain.Book;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    private BookEntity(CategoryEntity category, String title, String description, Boolean isAvailable) {
        this.category = category;
        this.title = title;
        this.description = description;
        this.isAvailable = isAvailable;
    }

    public static BookEntity from(Book book, CategoryEntity category) {
        return new BookEntity(category, book.getTitle(), book.getDescription(), book.getIsAvailable());
    }

    public Book toDomain() {
        return new Book(bookId, category.toDomain(), title, description, isAvailable);
    }
}
