package com.arushr.rentreturn.service;

import com.arushr.rentreturn.dto.user.WishlistItemDTO;
import com.arushr.rentreturn.dto.user.WishlistItemResponseDTO;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.model.WishlistItem;
import com.arushr.rentreturn.repository.WishlistItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;

    private WishlistItemResponseDTO toResponseDTO(WishlistItem item) {
        WishlistItemResponseDTO dto = new WishlistItemResponseDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImageUrl(item.getProduct().getImageUrl());
        dto.setCreatedAt(item.getCreatedAt() != null ? item.getCreatedAt().toString() : null);
        return dto;
    }

    @Override
    public WishlistItemResponseDTO addToWishlist(User user, WishlistItemDTO dto) {
        Product product = productService.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        wishlistItemRepository.findByUserAndProduct(user, product)
                .ifPresent(item -> { throw new RuntimeException("Product already in wishlist"); });
        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();
        return toResponseDTO(wishlistItemRepository.save(item));
    }

    @Override
    public void removeFromWishlist(User user, Long productId) {
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        wishlistItemRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    public List<WishlistItemResponseDTO> getWishlist(User user) {
        return wishlistItemRepository.findByUser(user)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }
} 