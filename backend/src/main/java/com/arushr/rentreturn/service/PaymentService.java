package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Payment;
import com.arushr.rentreturn.model.Rental;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentService {

    Payment createPayment(Rental rental, String method, Double amount);

    Optional<Payment> findById(Long id);

    List<Payment> findAll();

    Payment updateStatus(Long id, boolean successful);

    List<Payment> findByRental(Rental rental);

    double getTotalPaymentsAmount();

    long countSuccessfulPayments();

    void deletePayment(Long id);

    boolean isPaymentPending(Long id);

    // --- Added for controller completeness ---
    List<Payment> findByUserId(Long userId);

    List<Payment> findByMethod(String method);

    List<Payment> findByDateRange(LocalDateTime start, LocalDateTime end);

    List<Payment> findBySuccessful(boolean successful);

    List<Payment> findByAmountBetween(Double min, Double max);
}
