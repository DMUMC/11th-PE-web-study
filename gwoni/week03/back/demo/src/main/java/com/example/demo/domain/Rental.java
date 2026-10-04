package com.example.demo.domain;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class Rental {

    private Long rentalId;
    private Long userId;
    private Long bookId;
    private LocalDateTime rentedAt;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;

    public Rental(Long rentalId, Long userId, Long bookId, LocalDateTime rentedAt, LocalDateTime dueAt, LocalDateTime returnedAt) {
        this.rentalId = rentalId;
        this.userId = userId;
        this.bookId = bookId;
        this.rentedAt = rentedAt;
        this.dueAt = dueAt;
        this.returnedAt = returnedAt;
    }

    public static Rental rentNew(Long userId, Long bookId) {
        LocalDateTime now = LocalDateTime.now();
        return new Rental(null, userId, bookId, now, now.plusDays(7), null);
    }

}
