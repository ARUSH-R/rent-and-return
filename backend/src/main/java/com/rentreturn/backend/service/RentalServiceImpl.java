package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.RentalDTO;
import com.rentreturn.backend.mapper.RentalMapper;
import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final RentalMapper rentalMapper;

    @Override
    public RentalDTO createRental(RentalDTO rentalDTO) {
        Rental rental = rentalMapper.toEntity(rentalDTO);

        // set created and updated time
        rental.setCreatedAt(LocalDateTime.now());
        rental.setUpdatedAt(LocalDateTime.now());

        Rental saved = rentalRepository.save(rental);
        return rentalMapper.toDTO(saved);
    }

    @Override
    public RentalDTO getRentalById(int id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
        return rentalMapper.toDTO(rental);
    }

    @Override
    public List<RentalDTO> getAllRentals() {
        return rentalRepository.findAll().stream()
                .map(rentalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RentalDTO updateRental(int id, RentalDTO rentalDTO) {
        Rental existing = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));

        existing.setStartDate(LocalDate.parse(rentalDTO.getStartDate()));
        existing.setEndDate(LocalDate.parse(rentalDTO.getEndDate()));
        existing.setReturnedDate(rentalDTO.getReturnedDate() != null ? LocalDate.parse(rentalDTO.getReturnedDate()) : null);
        existing.setStatus(Rental.RentalStatus.valueOf(rentalDTO.getStatus()));
        existing.setRentalFee(rentalDTO.getRentalFee());
        existing.setUpdatedAt(LocalDateTime.now());

        Rental saved = rentalRepository.save(existing);
        return rentalMapper.toDTO(saved);
    }

    @Override
    public void deleteRental(int id) {
        rentalRepository.deleteById(id);
    }
}
