package com.example.demo.port;

import com.example.demo.domain.Book;

import java.util.List;

public interface BookPort {

    List<Book> findAllLatest();

    Book save(Book book);
}
