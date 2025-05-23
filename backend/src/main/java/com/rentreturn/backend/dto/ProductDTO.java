package com.rentreturn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    int id;

    String name;

    String description;

    float price;

    int stock;

    String category;

    LocalDateTime createdAt;

    boolean available;


}
