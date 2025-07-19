package com.arushr.rentreturn.dto.user;

import lombok.Data;

@Data
public class AddressResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private boolean isDefault;
    private String createdAt;
    private String updatedAt;
} 