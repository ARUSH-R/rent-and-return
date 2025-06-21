package com.arushr.rentreturn.controller.admin;

import com.arushr.rentreturn.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/users")
    public ResponseEntity<?> getUserCount() {
        return ResponseEntity.ok(adminStatsService.countUsers());
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProductCount() {
        return ResponseEntity.ok(adminStatsService.countProducts());
    }

    @GetMapping("/rentals")
    public ResponseEntity<?> getActiveRentalCount() {
        return ResponseEntity.ok(adminStatsService.countActiveRentals());
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getTotalRevenue() {
        return ResponseEntity.ok(adminStatsService.getTotalRevenue());
    }
}
