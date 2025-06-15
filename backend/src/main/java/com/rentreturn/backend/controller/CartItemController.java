package com.rentreturn.backend.controller;

import com.rentreturn.backend.model.CartItem;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.service.CartItemService;
import com.rentreturn.backend.service.ProductService;
import com.rentreturn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        CartItem cartItem = cartItemService.addItem(user, product, quantity);
        return ResponseEntity.ok(cartItem);
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
