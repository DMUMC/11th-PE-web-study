package com.umc.study.week.repository;

import com.umc.study.week.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByOrderByBookIdDesc();
}