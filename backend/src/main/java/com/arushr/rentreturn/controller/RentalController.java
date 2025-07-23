package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.exception.ResourceNotFoundException;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.enums.RentalStatus;
import com.arushr.rentreturn.service.RentalService;
import com.arushr.rentreturn.service.ProductService;
import com.arushr.rentreturn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

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
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RentalRequest request
    ) {
        String email = userDetails.getUsername();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Product product = productService.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));
        Rental rental = rentalService.create(Rental.builder()
                .user(user)
                .product(product)
                .rentalStart(LocalDateTime.now())
                .rentalEnd(LocalDateTime.now().plusDays(request.getDurationInDays()))
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(rental);
    }

    // DTO for request body
    public static class RentalRequest {
        private Long productId;
        private int durationInDays;
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getDurationInDays() { return durationInDays; }
        public void setDurationInDays(int durationInDays) { this.durationInDays = durationInDays; }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRental(@PathVariable Long id) {
        return rentalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Rental> returnRental(@PathVariable Long id) {
        Rental rental = rentalService.markReturned(id);
        return ResponseEntity.ok(rental);
    }

    @PutMapping("/{id}/extend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Rental> extendRental(
            @PathVariable Long id,
            @RequestParam int extraDays
    ) {
        Rental rental = rentalService.extendRental(id, extraDays);
        return ResponseEntity.ok(rental);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.cancelRental(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rental>> getByStatus(@RequestParam String status) {
        try {
            RentalStatus rentalStatus = RentalStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(rentalService.findByStatus(rentalStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rental>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(rentalService.findByRentalStartBetween(start, end));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rental>> getActiveRentals() {
        return ResponseEntity.ok(rentalService.findActive());
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rental>> getOverdueRentals() {
        return ResponseEntity.ok(rentalService.findOverdueRentals(LocalDateTime.now()));
    }
}
