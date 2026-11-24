package com.umc.study.week.service;

import com.umc.study.week.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Long userId, Long bookId) {
        rentalRepository.save(userId, bookId);
    }

    public void returnRental(Long rentalId) {
        rentalRepository.returnRental(rentalId);
    }
}
