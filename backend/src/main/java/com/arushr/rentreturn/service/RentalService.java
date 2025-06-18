package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.enums.RentalStatus;

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
