package com.arushr.rentreturn.service;

import com.arushr.rentreturn.enums.RentalStatus;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.repository.RentalRepository;
import com.arushr.rentreturn.service.EmailService;
import com.arushr.rentreturn.exception.BusinessRuleException;
import com.arushr.rentreturn.exception.ValidationException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final EmailService emailService;
    private final CartItemService cartItemService;

    @Override
    public Rental create(Rental rental) {
        // Rental limit: Only 1 active rental per user
        long activeRentals = rentalRepository.countByUserIdAndStatusAndDeletedFalse(
            rental.getUser().getId(), RentalStatus.ACTIVE
        );
        if (activeRentals > 0) {
            throw new BusinessRuleException("You already have an active rental. Return it before renting another product.");
        }
        
        // Check product availability and stock
        if (!rental.getProduct().isAvailable() || rental.getProduct().getStock() <= 0) {
            throw new BusinessRuleException("Product is not available for rental.");
        }
        
        // Rental duration logic: 1-30 days, start < end
        if (rental.getRentalStart() == null || rental.getRentalEnd() == null) {
            throw new ValidationException("Rental start and end dates are required.");
        }
        long days = java.time.temporal.ChronoUnit.DAYS.between(rental.getRentalStart(), rental.getRentalEnd());
        if (days < 1 || days > 30) {
            throw new ValidationException("Rental duration must be between 1 and 30 days.");
        }
        if (rental.getRentalEnd().isBefore(rental.getRentalStart())) {
            throw new ValidationException("Rental end date must be after start date.");
        }
        
        // Calculate total amount based on duration and price per day
        if (rental.getTotalAmount() == null) {
            BigDecimal dailyRate = rental.getProduct().getPricePerDay();
            BigDecimal totalAmount = dailyRate.multiply(BigDecimal.valueOf(days));
            rental.setTotalAmount(totalAmount);
        }
        
        // Set initial status to PENDING
        rental.setStatus(RentalStatus.PENDING);
        
        Rental saved = rentalRepository.save(rental);
        // Clear user's cart after successful rental
        cartItemService.clearCart(rental.getUser());
        // Send confirmation email
        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            String subject = "Rental Confirmation - Rent & Return";
            String text = String.format("Dear %s,\n\nYour rental for product ID %d has been confirmed.\nRental Period: %s to %s\nTotal Amount: %s\n\nThank you for using Rent & Return!",
                saved.getUser().getUsername(),
                saved.getProduct() != null ? saved.getProduct().getId() : null,
                saved.getRentalStart(),
                saved.getRentalEnd(),
                saved.getTotalAmount()
            );
            emailService.sendSimpleMessage(saved.getUser().getEmail(), subject, text);
        }
        return saved;
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
        return rentalRepository.findByStatusAndDeletedFalse(RentalStatus.ACTIVE);
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
                throw new ValidationException("Rental end date is not set");
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
        return rentalRepository.findByStatusAndDeletedFalse(status);
    }

    @Override
    public List<Rental> findByRentalStartBetween(LocalDateTime start, LocalDateTime end) {
        return rentalRepository.findByRentalStartBetween(start, end)
                .stream()
                .filter(r -> !r.isDeleted())
                .toList();
    }
}
