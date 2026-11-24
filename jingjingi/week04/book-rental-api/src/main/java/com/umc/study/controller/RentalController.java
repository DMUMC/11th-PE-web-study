package com.umc.study.controller;

import com.umc.study.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(
            @RequestBody Map<String, Object> body
    ) {
        long userId = requirePositiveLong(body, "userId");
        long bookId = requirePositiveLong(body, "bookId");
        Map<String, Object> createdRental = rentalService.createRental(userId, bookId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRental);
    }

    private long requirePositiveLong(Map<String, Object> body, String fieldName) {
        Object value = body.get(fieldName);
        if (!(value instanceof Number number) || number.longValue() <= 0) {
            throw new IllegalArgumentException(fieldName + "는 1 이상의 숫자여야 합니다.");
        }
        return number.longValue();
    }
}
