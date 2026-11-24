package com.example.demo.controller;

import com.example.demo.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody RentalRequest body) {
        if (body.userId() == null || body.bookId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "userId와 bookId는 필수입니다."
            );
        }

        rentalService.createRental(body.userId(), body.bookId());

        return "대여 기록이 등록되었습니다!";
    }

    public record RentalRequest(Long userId, Long bookId) {
    }
}