package com.arushr.rentreturn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(optional = false)
    @JoinColumn(name = "rental_id", nullable = false)
    private Rental rental;

    @NotBlank
    @Size(max = 50)
    private String method; // e.g. UPI, Card, COD, etc.

    @NotNull
    @PositiveOrZero
    private Double amount;

    /**
     * -- GETTER --
     *  Returns true if the payment is successful.
     */
    @Column(nullable = false)
    private boolean successful;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime paidAt;

    @Version
    private Long version;

    // Stripe payment intent ID (nullable for non-Stripe payments)
    @Column(name = "stripe_payment_intent_id", length = 100)
    private String stripePaymentIntentId;

    // Stripe payment status (nullable for non-Stripe payments)
    @Column(name = "stripe_status", length = 50)
    private String stripeStatus;

    // Stripe receipt URL (nullable for non-Stripe payments)
    @Column(name = "stripe_receipt_url", length = 255)
    private String stripeReceiptUrl;

    /**
     * Marks the payment as successful.
     */
    public void markSuccessful() {
        this.successful = true;
    }

    /**
     * Marks the payment as failed.
     */
    public void markFailed() {
        this.successful = false;
    }

    /**
     * Returns true if the payment is not marked successful.
     */
    public boolean isPending() {
        return !this.successful;
    }

    /**
     * Resets the payment status to not successful.
     */
    public void resetStatus() {
        this.successful = false;
    }

    /**
     * Returns true if this payment is for the given rental.
     */
    public boolean isForRental(Rental rental) {
        return this.rental != null && rental != null && this.rental.getId().equals(rental.getId());
    }

    /**
     * Sets the payment method if not blank.
     */
    public void setMethodIfValid(String method) {
        if (method != null && !method.isBlank()) {
            this.method = method;
        }
    }
}
