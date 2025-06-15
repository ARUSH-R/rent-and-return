package com.rentreturn.backend.service;

import com.rentreturn.backend.enums.RentalStatus;
import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.repository.RentalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;

    @Override
    public Rental create(Rental rental) {
        return rentalRepository.save(rental);
    }

    @Override
    public Optional<Rental> findById(Long id) {
        return rentalRepository.findById(id).filter(r -> !r.isDeleted());
    }

    @Override
    public List<Rental> findAll() {
        return rentalRepository.findAllByDeletedFalse();
    }

    @Override
    public List<Rental> findActive() {
        return rentalRepository.findByStatus(RentalStatus.ACTIVE)
                .stream()
                .filter(r -> !r.isDeleted())
                .toList();
    }

    @Override
    public List<Rental> findByUserId(Long userId) {
        return rentalRepository.findAllByUserIdAndDeletedFalse(userId);
    }

    @Override
    public List<Rental> findByProductId(Long productId) {
        return rentalRepository.findAllByProductIdAndDeletedFalse(productId);
    }

    @Override
    public Rental markReturned(Long rentalId) {
        return rentalRepository.findById(rentalId).map(rental -> {
            rental.setStatus(RentalStatus.RETURNED);
            return rentalRepository.save(rental);
        }).orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    @Override
    public Rental extendRental(Long rentalId, int extraDays) {
        return rentalRepository.findById(rentalId).map(rental -> {
            if (rental.getRentalEnd() == null) {
                throw new RuntimeException("Rental end date is not set");
            }
            rental.setRentalEnd(rental.getRentalEnd().plusDays(extraDays));
            return rentalRepository.save(rental);
        }).orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    @Override
    public void cancelRental(Long rentalId) {
        rentalRepository.findById(rentalId).ifPresent(rental -> {
            rental.softDelete();
            rentalRepository.save(rental);
        });
    }

    @Override
    public long countActive() {
        return rentalRepository.findByStatus(RentalStatus.ACTIVE)
                .stream()
                .filter(r -> !r.isDeleted())
                .count();
    }

    @Override
    public long countAll() {
        return rentalRepository.countByDeletedFalse();
    }

    @Override
    public List<Rental> findOverdueRentals(LocalDateTime now) {
        return rentalRepository.findAllByRentalEndBeforeAndStatusNotAndDeletedFalse(now, RentalStatus.RETURNED);
    }

    @Override
    public List<Rental> findByStatus(RentalStatus status) {
        return rentalRepository.findByStatus(status)
                .stream()
                .filter(r -> !r.isDeleted())
                .toList();
    }

    @Override
    public List<Rental> findByRentalStartBetween(LocalDateTime start, LocalDateTime end) {
        return rentalRepository.findByRentalStartBetween(start, end)
                .stream()
                .filter(r -> !r.isDeleted())
                .toList();
    }
}
