package com.rentreturn.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CartItem entity representing a product in a user's cart.
 */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private boolean reserved;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedAt;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        if (this.quantity == null || this.quantity < 1) {
            this.quantity = 1;
        }
        this.reserved = false;
    }

    /**
     * Increments the quantity by the given amount.
     */
    public void incrementQuantity(int amount) {
        if (amount < 1) throw new IllegalArgumentException("Amount must be positive");
        this.quantity += amount;
    }

    /**
     * Decrements the quantity by the given amount.
     */
    public void decrementQuantity(int amount) {
        if (amount < 1) throw new IllegalArgumentException("Amount must be positive");
        if (this.quantity - amount < 1) throw new IllegalArgumentException("Quantity cannot be less than 1");
        this.quantity -= amount;
    }

    /**
     * Clears the reserved flag.
     */
    public void clearReservation() {
        this.reserved = false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartItem cartItem)) return false;
        return id != null && id.equals(cartItem.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
