package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.RentalDTO;

import java.util.List;

public interface RentalService {

    RentalDTO createRental(RentalDTO rentalDTO);

    RentalDTO getRentalById(int id);

    List<RentalDTO> getAllRentals();

    RentalDTO updateRental(int id, RentalDTO rentalDTO);

    void deleteRental(int id);
}
