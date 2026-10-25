package com.umc.study.dto;

import com.umc.study.entity.Book;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookDTO {
    public record CreateBookRequest(
            @NotNull(message = "카테고리 ID는 필수입니다.")
            Long categoryId,

            @NotBlank(message = "도서 제목은 필수입니다.")
            @Size(max = 100, message = "도서 제목은 100자 이하이어야 합니다.")
            String title,

            String description
    ) {}

    public record BookResponse(
            Long bookId,
            String title,
            String description,
            String categoryName,
            Boolean isAvailable
    ) {
        public static BookResponse from(Book book) {
            return new BookResponse(
                    book.getBookId(),
                    book.getTitle(),
                    book.getDescription(),
                    book.getCategory().getName(),
                    book.getIsAvailable()
            );
        }
    }
}
