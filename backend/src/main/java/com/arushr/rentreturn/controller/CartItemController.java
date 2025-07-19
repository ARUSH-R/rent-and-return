package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.model.CartItem;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.service.CartItemService;
import com.arushr.rentreturn.service.ProductService;
import com.arushr.rentreturn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartItemRequest request
    ) {
        String email = userDetails.getUsername();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        Product product = productService.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));
        CartItem cartItem = cartItemService.addItem(user, product, request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    // DTO for request body
    public static class CartItemRequest {
        private Long productId;
        private int quantity;
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getCartItem(@PathVariable Long id) {
        return cartItemService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCartItemsByUser(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return ResponseEntity.ok(cartItemService.findByUser(user));
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            // Fallback to SecurityContextHolder
            Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("DEBUG: Principal from SecurityContextHolder: " + principal);
            if (principal instanceof UserDetails details) {
                userDetails = details;
            } else {
                return ResponseEntity.status(401).build();
            }
        } else {
            System.out.println("DEBUG: Principal from @AuthenticationPrincipal: " + userDetails);
        }
        String email = userDetails.getUsername();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        List<CartItem> items = cartItemService.findByUser(user);
        return ResponseEntity.ok(java.util.Collections.singletonMap("items", items));
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable Long id,
            @RequestParam int quantity
    ) {
        CartItem updated = cartItemService.updateQuantity(id, quantity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartItemService.removeItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCartForUser(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        cartItemService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
