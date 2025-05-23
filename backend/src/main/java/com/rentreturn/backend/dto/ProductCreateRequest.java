package com.rentreturn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {

    private String name;

    private String description;

    private float price;

    private int stock;

    private boolean available;

    private String category;


}
