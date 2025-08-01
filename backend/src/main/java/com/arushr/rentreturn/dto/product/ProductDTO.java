package com.arushr.rentreturn.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 10, fraction = 2)
    private BigDecimal pricePerDay;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotBlank
    @Size(max = 50)
    private String category;

    @Size(max = 255)
    private String imageUrl;

    private boolean available;

    @NotBlank
    @Size(max = 50)
    private String createdBy;

    @NotBlank
    @Size(max = 50)
    private String updatedBy;
}
