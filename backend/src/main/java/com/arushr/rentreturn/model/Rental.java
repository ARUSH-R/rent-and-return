package com.arushr.rentreturn.model;

import com.arushr.rentreturn.enums.RentalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rental implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime rentalStart;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus rentalStatus = RentalStatus.ACTIVE;


    @NotNull
    @Column(nullable = false)
    private LocalDateTime rentalEnd;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RentalStatus status;

    @Column(nullable = false)
    private boolean deleted;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @Size(max = 50)
    @Column(length = 50)
    private String createdBy;

    @Size(max = 50)
    @Column(length = 50)
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = RentalStatus.ACTIVE;
        }
        this.deleted = false;
    }

    public boolean isRentalPeriodValid() {
        return rentalEnd != null && rentalStart != null && rentalEnd.isAfter(rentalStart);
    }

    public boolean isCurrentlyOverdue() {
        return !deleted && status != RentalStatus.RETURNED && rentalEnd.isBefore(LocalDateTime.now());
    }

    public void markReturned() {
        if (this.status != RentalStatus.RETURNED) {
            this.status = RentalStatus.RETURNED;
        }
    }

    public void markOverdue() {
        if (this.status != RentalStatus.OVERDUE) {
            this.status = RentalStatus.OVERDUE;
        }
    }

    public void markActive() {
        if (this.status != RentalStatus.ACTIVE) {
            this.status = RentalStatus.ACTIVE;
        }
    }

    public boolean isActive() {
        return this.status == RentalStatus.ACTIVE;
    }

    public void softDelete() {
        this.deleted = true;
    }

    public void updateAudit(String updater) {
        if (updater != null) {
            this.updatedBy = updater;
        }
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Rental{" +
                "id=" + id +
                ", user=" + (user != null ? user.getId() : null) +
                ", product=" + (product != null ? product.getId() : null) +
                ", rentalStart=" + rentalStart +
                ", rentalEnd=" + rentalEnd +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                ", deleted=" + deleted +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Rental rental)) return false;
        return id != null && id.equals(rental.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
