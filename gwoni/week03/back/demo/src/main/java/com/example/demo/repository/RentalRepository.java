package com.example.demo.repository;

import com.example.demo.domain.Rental;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Rental rental){
        String sql = "INSERT INTO rental (rental_id, user_id, book_id, rented_at, due_at, returned_at) VALUES (?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(
                sql,
                rental.getRentalId(),
                rental.getUserId(),
                rental.getBookId(),
                rental.getRentedAt(),
                rental.getDueAt(),
                rental.getReturnedAt()
        );
    }
}
