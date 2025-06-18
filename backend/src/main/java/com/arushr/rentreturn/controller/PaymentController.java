package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.model.Payment;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.service.PaymentService;
import com.arushr.rentreturn.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @RequestParam Long rentalId,
            @RequestParam String method,
            @RequestParam Double amount
    ) {
        Rental rental = rentalService.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found with ID: " + rentalId));
        Payment payment = paymentService.createPayment(rental, method, amount);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        return paymentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean successful
    ) {
        Payment updated = paymentService.updateStatus(id, successful);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/com/arushr/rentreturn/dto/rental/{rentalId}")
    public ResponseEntity<List<Payment>> getByRental(@PathVariable Long rentalId) {
        Rental rental = rentalService.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
        return ResponseEntity.ok(paymentService.findByRental(rental));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary/total")
    public ResponseEntity<Double> getTotalPayments() {
        return ResponseEntity.ok(paymentService.getTotalPaymentsAmount());
    }

    @GetMapping("/summary/count-successful")
    public ResponseEntity<Long> countSuccessful() {
        return ResponseEntity.ok(paymentService.countSuccessfulPayments());
    }

    @GetMapping("/{id}/pending")
    public ResponseEntity<Boolean> isPending(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.isPaymentPending(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getByUser(@PathVariable Long userId) {
        // Not implemented in service
        throw new UnsupportedOperationException("Not implemented");
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<List<Payment>> getByMethod(@PathVariable String method) {
        // Not implemented in service
        throw new UnsupportedOperationException("Not implemented");
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> getByDateRange(
            @RequestParam String start,
            @RequestParam String end
    ) {
        // Not implemented in service
        throw new UnsupportedOperationException("Not implemented");
    }

    @GetMapping("/status")
    public ResponseEntity<List<Payment>> getByStatus(@RequestParam boolean successful) {
        // Not implemented in service
        throw new UnsupportedOperationException("Not implemented");
    }

    @GetMapping("/amount-range")
    public ResponseEntity<List<Payment>> getByAmountRange(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        // Not implemented in service
        throw new UnsupportedOperationException("Not implemented");
    }
}
