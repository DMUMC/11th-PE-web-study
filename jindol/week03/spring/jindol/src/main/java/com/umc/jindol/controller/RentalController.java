package com.umc.jindol.controller;

import com.umc.jindol.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals") // 이 컨트롤러의 기본 주소는 /rentals
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST http://localhost:8080/rentals
    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "대여 등록이 완료되었습니다!";
    }
}