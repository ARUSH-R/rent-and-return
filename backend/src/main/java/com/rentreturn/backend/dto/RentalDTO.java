package com.rentreturn.backend.dto;

import lombok.Data;

@Data
public class RentalDTO {

    private int id;

    private int userId;

    private int productId;

    private String startDate;

    private String endDate;

    private String returnedDate;

    private String status;

    private double rentalFee;

    private String createdAt;

    private String updatedAt;
}
