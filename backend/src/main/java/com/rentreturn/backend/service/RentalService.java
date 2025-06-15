package com.rentreturn.backend.service;

import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.enums.RentalStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RentalService {

    Rental create(Rental rental);

    Optional<Rental> findById(Long id);

    List<Rental> findAll();

    List<Rental> findActive();

    List<Rental> findByUserId(Long userId);

    List<Rental> findByProductId(Long productId);

    Rental markReturned(Long rentalId);

    Rental extendRental(Long rentalId, int extraDays);

    void cancelRental(Long rentalId);

    long countActive();

    long countAll();

    List<Rental> findOverdueRentals(LocalDateTime currentTime);

    List<Rental> findByStatus(RentalStatus status);

    List<Rental> findByRentalStartBetween(LocalDateTime start, LocalDateTime end);
}
