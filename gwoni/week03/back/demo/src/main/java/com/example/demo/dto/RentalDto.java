package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentalDto {
    private Long rentalId;
    private Long userId;
    private Long bookId;
    private LocalDateTime rentedAt;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;
}
