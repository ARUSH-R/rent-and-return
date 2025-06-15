package com.rentreturn.backend.service;

import com.rentreturn.backend.model.Payment;
import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public Payment createPayment(Rental rental, String method, Double amount) {
        Payment payment = Payment.builder()
                .rental(rental)
                .method(method)
                .amount(amount)
                .successful(false)
                .build();
        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment updateStatus(Long id, boolean successful) {
        return paymentRepository.findById(id).map(payment -> {
            if (successful) {
                payment.markSuccessful();
            } else {
                payment.markFailed();
            }
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public List<Payment> findByRental(Rental rental) {
        return paymentRepository.findByRental(rental);
    }

    @Override
    public double getTotalPaymentsAmount() {
        return paymentRepository.findAll().stream()
                .filter(Payment::isSuccessful)
                .mapToDouble(Payment::getAmount)
                .sum();
    }

    @Override
    public long countSuccessfulPayments() {
        return paymentRepository.countBySuccessful(true);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public boolean isPaymentPending(Long id) {
        return paymentRepository.findById(id)
                .map(Payment::isPending)
                .orElse(false);
    }

    // --- Stubs for not implemented methods ---

    @Override
    public List<Payment> findByUserId(Long userId) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public List<Payment> findByMethod(String method) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public List<Payment> findByDateRange(java.time.LocalDateTime start, java.time.LocalDateTime end) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public List<Payment> findBySuccessful(boolean successful) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public List<Payment> findByAmountBetween(Double min, Double max) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
