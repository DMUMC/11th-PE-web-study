package com.umc.study.rental;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

    @Transactional
    public Map<String, Object> createRental(long userId, long bookId) {
        return rentalRepository.create(userId, bookId);
    }
}
