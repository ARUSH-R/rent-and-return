package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.model.Payment;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.service.PaymentService;
import com.arushr.rentreturn.service.RentalService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.arushr.rentreturn.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final RentalService rentalService;
    private final StripeService stripeService;

    @Value("${stripe.webhook.secret:}")
    private String stripeWebhookSecret;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Double> getTotalPayments() {
        return ResponseEntity.ok(paymentService.getTotalPaymentsAmount());
    }

    @GetMapping("/summary/count-successful")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countSuccessful() {
        return ResponseEntity.ok(paymentService.countSuccessfulPayments());
    }

    @GetMapping("/{id}/pending")
    public ResponseEntity<Boolean> isPending(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.isPaymentPending(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.findByUserId(userId));
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<List<Payment>> getByMethod(@PathVariable String method) {
        return ResponseEntity.ok(paymentService.findByMethod(method));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> getByDateRange(
            @RequestParam String start,
            @RequestParam String end
    ) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(paymentService.findByDateRange(startDate, endDate));
    }

    @GetMapping("/status")
    public ResponseEntity<List<Payment>> getByStatus(@RequestParam boolean successful) {
        return ResponseEntity.ok(paymentService.findBySuccessful(successful));
    }

    @GetMapping("/amount-range")
    public ResponseEntity<List<Payment>> getByAmountRange(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        return ResponseEntity.ok(paymentService.findByAmountBetween(min, max));
    }

    /**
     * Create a Stripe payment intent for a rental.
     * @param rentalId Rental ID
     * @param email Customer email (optional, for Stripe receipt)
     * @return clientSecret for Stripe.js
     */
    @PostMapping("/stripe/create-intent")
    public ResponseEntity<?> createStripePaymentIntent(@RequestParam Long rentalId, @RequestParam(required = false) String email) {
        Rental rental = rentalService.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rental not found"));
        long amountCents = rental.getTotalAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue();
        try {
            java.util.Map<String, String> metadata = new java.util.HashMap<>();
            metadata.put("rentalId", rentalId.toString());
            PaymentIntent intent = stripeService.createPaymentIntent(amountCents, "inr", email, metadata);
            // Optionally, create a Payment entity here with status pending and intent ID
            Payment payment = paymentService.createPayment(rental, "STRIPE", rental.getTotalAmount().doubleValue());
            payment.setStripePaymentIntentId(intent.getId());
            payment.setStripeStatus(intent.getStatus());
            paymentService.save(payment);
            return ResponseEntity.ok(java.util.Map.of(
                    "clientSecret", intent.getClientSecret(),
                    "paymentId", payment.getId()
            ));
        } catch (StripeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stripe error: " + e.getMessage());
        }
    }

    /**
     * Stripe webhook endpoint to handle payment events.
     */
    @PostMapping(value = "/webhook", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        if (stripeWebhookSecret == null || stripeWebhookSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Webhook secret not configured");
        }
        try {
            com.stripe.model.Event event = stripeService.constructEventFromPayload(payload, sigHeader, stripeWebhookSecret);
            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                if (intent != null) {
                    // Fetch the associated Charge to get the receipt URL
                    String receiptUrl = null;
                    try {
                        com.stripe.param.ChargeListParams params = com.stripe.param.ChargeListParams.builder()
                                .setPaymentIntent(intent.getId())
                                .build();
                        com.stripe.model.ChargeCollection charges = com.stripe.model.Charge.list(params);
                        if (!charges.getData().isEmpty()) {
                            receiptUrl = charges.getData().get(0).getReceiptUrl();
                        }
                    } catch (Exception e) {
                        // Log and continue without receipt URL
                        receiptUrl = null;
                    }
                    paymentService.markStripePaymentSuccessful(intent.getId(), intent.getStatus(), receiptUrl);
                }
            } else if ("payment_intent.payment_failed".equals(event.getType())) {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                if (intent != null) {
                    paymentService.markStripePaymentFailed(intent.getId(), intent.getStatus());
                }
            }
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }
}
