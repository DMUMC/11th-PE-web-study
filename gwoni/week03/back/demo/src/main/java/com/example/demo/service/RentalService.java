package com.example.demo.service;

import com.example.demo.domain.Rental;
import com.example.demo.dto.RentalDto;
import com.example.demo.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

    public void createRental(RentalDto dto){
        Rental rental = Rental.rentNew(dto.getUserId(), dto.getBookId());
        rentalRepository.save(rental);
    }
}
