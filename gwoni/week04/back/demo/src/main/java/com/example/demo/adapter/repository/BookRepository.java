package com.example.demo.adapter.repository;

import com.example.demo.adapter.entity.BookEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<BookEntity, Long> {

    @EntityGraph(attributePaths = "category")
    List<BookEntity> findAllByOrderByBookIdDesc();
}
