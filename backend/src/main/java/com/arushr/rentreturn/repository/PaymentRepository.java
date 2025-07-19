package com.arushr.rentreturn.repository;

import com.arushr.rentreturn.model.Payment;
import com.arushr.rentreturn.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByRental(Rental rental);

    boolean existsByRental(Rental rental);

    List<Payment> findBySuccessfulTrue();

    List<Payment> findBySuccessfulFalse();

    long countBySuccessfulTrue();

    long countBySuccessfulFalse();

    List<Payment> findByMethodIgnoreCase(String method);

    List<Payment> findByPaidAtAfter(java.time.LocalDateTime date);

    List<Payment> findAllByRentalId(Long rentalId);

    long countBySuccessful(boolean successful);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.successful = true")
    Double sumSuccessfulPayments();

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Add as needed for new service methods
}
