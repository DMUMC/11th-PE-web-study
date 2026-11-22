package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByIdDesc();

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByCategoryIdOrderByIdDesc(Long categoryId);
}
