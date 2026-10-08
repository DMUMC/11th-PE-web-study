package com.umc.study.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false, length = 50)
    private String name;

    protected Category() {}

    public Category(String name) {
        this.name = name;
    }

    public Long getCategoryId() { return categoryId; }
    public String getName() { return name; }
}
