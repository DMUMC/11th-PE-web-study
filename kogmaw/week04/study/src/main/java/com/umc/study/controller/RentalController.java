package com.umc.study.controller;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody RentalCreateRequest request) {
        rentalService.createRental(request);
        return "도서 대여 기록이 생성되었습니다.";
    }
}
