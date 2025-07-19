package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Payment;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.repository.PaymentRepository;
import com.arushr.rentreturn.service.EmailService;
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
    private final EmailService emailService;

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
        Double sum = paymentRepository.sumSuccessfulPayments();
        return sum != null ? sum : 0.0;
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

    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public void markStripePaymentSuccessful(String stripePaymentIntentId, String stripeStatus, String receiptUrl) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found for Stripe intent: " + stripePaymentIntentId));
        payment.setSuccessful(true);
        payment.setStripeStatus(stripeStatus);
        payment.setStripeReceiptUrl(receiptUrl);
        paymentRepository.save(payment);
        // Send payment receipt email
        if (payment.getRental() != null && payment.getRental().getUser() != null && payment.getRental().getUser().getEmail() != null) {
            String subject = "Payment Successful - Rent & Return";
            String text = String.format("Dear %s,\n\nYour payment for rental ID %d was successful.\nAmount: %s\nReceipt: %s\n\nThank you for using Rent & Return!",
                payment.getRental().getUser().getUsername(),
                payment.getRental().getId(),
                payment.getAmount(),
                receiptUrl != null ? receiptUrl : "N/A"
            );
            emailService.sendSimpleMessage(payment.getRental().getUser().getEmail(), subject, text);
        }
    }

    @Override
    public void markStripePaymentFailed(String stripePaymentIntentId, String stripeStatus) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found for Stripe intent: " + stripePaymentIntentId));
        payment.setSuccessful(false);
        payment.setStripeStatus(stripeStatus);
        paymentRepository.save(payment);
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
