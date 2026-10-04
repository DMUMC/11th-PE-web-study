package com.example.demo.controller;

import com.example.demo.dto.RentalDto;
import com.example.demo.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody RentalDto rental){
        rentalService.createRental(rental);
        return "대여 기록이 생성되었습니다!";
    }
}
