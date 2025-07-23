package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.dto.user.WishlistItemDTO;
import com.arushr.rentreturn.dto.user.WishlistItemResponseDTO;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.service.UserService;
import com.arushr.rentreturn.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserService userService;

    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<WishlistItemResponseDTO> addToWishlist(@AuthenticationPrincipal UserDetails userDetails,
                                                                @Valid @RequestBody WishlistItemDTO dto) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistService.addToWishlist(user, dto));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long productId) {
        User user = getCurrentUser(userDetails);
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemResponseDTO>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }
} 