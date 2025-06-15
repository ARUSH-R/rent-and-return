package com.rentreturn.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Product entity representing rentable items.
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product implements Serializable {

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
    @PositiveOrZero
    @Column(nullable = false)
    private Double price;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock = 1;

    @Size(max = 50)
    private String category;

    @Size(max = 255)
    private String imageUrl;

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false)
    private boolean deleted = false;

    @Size(max = 50)
    private String createdBy;

    @Size(max = 50)
    private String updatedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Marks the product as deleted and unavailable.
     */
    public void softDelete() {
        this.deleted = true;
        this.available = false;
    }

    /**
     * Updates the stock and availability.
     * @param newStock the new stock value
     */
    public void restock(int newStock) {
        this.stock = newStock;
        this.available = newStock > 0;
    }

    /**
     * Updates product fields if the provided values are not null.
     */
    public void updateProduct(String name, String description, Double price, String category, String imageUrl) {
        if (name != null) this.name = name;
        if (description != null) this.description = description;
        if (price != null) this.price = price;
        if (category != null) this.category = category;
        if (imageUrl != null) this.imageUrl = imageUrl;
    }
}
