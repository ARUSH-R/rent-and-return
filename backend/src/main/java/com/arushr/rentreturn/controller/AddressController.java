package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.dto.user.AddressDTO;
import com.arushr.rentreturn.dto.user.AddressResponseDTO;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.service.AddressService;
import com.arushr.rentreturn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;

    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<AddressResponseDTO> createAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                           @Valid @RequestBody AddressDTO dto) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> updateAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable Long id,
                                                           @Valid @RequestBody AddressDTO dto) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(addressService.updateAddress(user, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal UserDetails userDetails,
                                              @PathVariable Long id) {
        User user = getCurrentUser(userDetails);
        addressService.deleteAddress(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressResponseDTO> setDefaultAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                               @PathVariable Long id) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(addressService.setDefaultAddress(user, id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> getAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                        @PathVariable Long id) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(addressService.getAddress(user, id));
    }
} 