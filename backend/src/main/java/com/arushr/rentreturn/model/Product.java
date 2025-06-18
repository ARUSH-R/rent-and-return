package com.arushr.rentreturn.model;

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
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerDay;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;

    @NotBlank
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String category;

    @Size(max = 255)
    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false)
    private boolean available;

    @Column(nullable = false)
    private boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @NotBlank
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String createdBy;

    @NotBlank
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String updatedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.stock == null) this.stock = 1;
        this.available = this.stock > 0;
        this.deleted = false;
    }

    public void softDelete() {
        this.deleted = true;
        this.available = false;
    }

    public void restock(int newStock) {
        if (newStock < 0) throw new IllegalArgumentException("Stock cannot be negative");
        this.stock = newStock;
        this.available = newStock > 0;
    }

    public void updateProduct(String name, String description, BigDecimal pricePerDay, String category, String imageUrl) {
        if (name != null) this.name = name;
        if (description != null) this.description = description;
        if (pricePerDay != null) this.pricePerDay = pricePerDay;
        if (category != null) this.category = category;
        if (imageUrl != null) this.imageUrl = imageUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id != null && id.equals(product.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pricePerDay=" + pricePerDay +
                ", stock=" + stock +
                ", available=" + available +
                ", deleted=" + deleted +
                '}';
    }

    public void markAvailable() {
        this.available = true;
    }

    public void markUnavailable() {
        this.available = false;
    }

    public void updateAudit(String updatedBy) {
        if (updatedBy != null) {
            this.updatedBy = updatedBy;
        }
        this.updatedAt = LocalDateTime.now();
    }
}