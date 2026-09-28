package com.example.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Book {
    private Long bookId;
    private Long categoryId;
    private String title;
    private String description;
    private Boolean isAvailable;
}
