package com.umc.study.book;

public record BookResponse(Long bookId, String title, String description,
        Long categoryId, String categoryName, Boolean isAvailable) {
    public static BookResponse from(Book book) {
        return new BookResponse(book.getBookId(), book.getTitle(), book.getDescription(),
                book.getCategory().getCategoryId(), book.getCategory().getName(),
                book.getIsAvailable());
    }
}
