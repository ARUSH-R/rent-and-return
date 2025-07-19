package com.arushr.rentreturn.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistItemDTO {
    @NotNull
    private Long productId;
} 