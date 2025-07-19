package com.arushr.rentreturn.dto.user;

import lombok.Data;

@Data
public class WishlistItemResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String createdAt;
} 