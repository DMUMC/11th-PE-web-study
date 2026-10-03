package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    @Transactional
    public Map<String, Object> createRental(long userId, long bookId) {
        if (userId <= 0 || bookId <= 0) {
            throw new IllegalArgumentException("userId와 bookId는 1 이상의 숫자여야 합니다.");
        }
        return rentalRepository.save(userId, bookId);
    }
}
