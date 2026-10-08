package com.umc.study.dto;

import com.umc.study.domain.Book;

public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.isAvailable()
        );
    }
}
