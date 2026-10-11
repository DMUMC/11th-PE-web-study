package com.umc.study.rental;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.umc.study.common.RequestValues;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {
    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRental(@RequestBody Map<String, Object> body) {
        long userId = RequestValues.readPositiveId(body, "userId");
        long bookId = RequestValues.readPositiveId(body, "bookId");
        return rentalService.createRental(userId, bookId);
    }
}
