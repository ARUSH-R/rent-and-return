package com.arushr.rentreturn.service;

import com.arushr.rentreturn.dto.user.WishlistItemDTO;
import com.arushr.rentreturn.dto.user.WishlistItemResponseDTO;
import com.arushr.rentreturn.model.User;

import java.util.List;

public interface WishlistService {
    WishlistItemResponseDTO addToWishlist(User user, WishlistItemDTO dto);
    void removeFromWishlist(User user, Long productId);
    List<WishlistItemResponseDTO> getWishlist(User user);
} 