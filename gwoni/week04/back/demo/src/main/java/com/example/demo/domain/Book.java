package com.example.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Book {
    private Long bookId;
    private Category category;
    private String title;
    private String description;
    private Boolean isAvailable;

    public static Book registerNew(Category category, String title, String description) {
        return new Book(null, category, title, description, true);
    }
}
