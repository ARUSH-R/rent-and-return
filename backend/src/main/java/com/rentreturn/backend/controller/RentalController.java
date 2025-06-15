package com.rentreturn.backend.controller;

import com.rentreturn.backend.exception.ResourceNotFoundException;
import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.enums.RentalStatus;
import com.rentreturn.backend.service.RentalService;
import com.rentreturn.backend.service.ProductService;
import com.rentreturn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;
    private final UserService userService;
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Rental> createRental(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int durationInDays
    ) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        Rental rental = rentalService.create(Rental.builder()
                .user(user)
                .product(product)
                .rentalStart(LocalDateTime.now())
                .rentalEnd(LocalDateTime.now().plusDays(durationInDays))
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(rental);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRental(@PathVariable Long id) {
        return rentalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {
        return ResponseEntity.ok(rentalService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rental>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(rentalService.findByUserId(userId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Rental>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(rentalService.findByProductId(productId));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<Rental> returnRental(@PathVariable Long id) {
        Rental rental = rentalService.markReturned(id);
        return ResponseEntity.ok(rental);
    }

    @PutMapping("/{id}/extend")
    public ResponseEntity<Rental> extendRental(
            @PathVariable Long id,
            @RequestParam int extraDays
    ) {
        Rental rental = rentalService.extendRental(id, extraDays);
        return ResponseEntity.ok(rental);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.cancelRental(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    public ResponseEntity<List<Rental>> getByStatus(@RequestParam String status) {
        try {
            RentalStatus rentalStatus = RentalStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(rentalService.findByStatus(rentalStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Rental>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(rentalService.findByRentalStartBetween(start, end));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Rental>> getActiveRentals() {
        return ResponseEntity.ok(rentalService.findActive());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Rental>> getOverdueRentals() {
        return ResponseEntity.ok(rentalService.findOverdueRentals(LocalDateTime.now()));
    }
}
