package com.rentreturn.backend.mapper;

import com.rentreturn.backend.dto.RentalDTO;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.Rental;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.ProductRepository;
import com.rentreturn.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class RentalMapper {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public RentalDTO toDTO(Rental rental) {
        RentalDTO rentalDTO = new RentalDTO();
        rentalDTO.setId(rental.getId());
        rentalDTO.setUserId(rental.getUser().getId().intValue());
        rentalDTO.setProductId(rental.getProduct().getId());
        rentalDTO.setStartDate(rental.getStartDate().toString());
        rentalDTO.setEndDate(rental.getEndDate().toString());
        rentalDTO.setReturnedDate(rental.getReturnedDate() != null ? rental.getReturnedDate().toString() : null);
        rentalDTO.setStatus(rental.getStatus().name());
        rentalDTO.setRentalFee(rental.getRentalFee());
        rentalDTO.setCreatedAt(rental.getCreatedAt() != null ? rental.getCreatedAt().toString() : null);
        rentalDTO.setUpdatedAt(rental.getUpdatedAt() != null ? rental.getUpdatedAt().toString() : null);
        return rentalDTO;
    }

    public Rental toEntity(RentalDTO rentalDTO){
        Rental rental = new Rental();
        rental.setId(rentalDTO.getId());

        User user = userRepository.findById(Long.valueOf(rentalDTO.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + rentalDTO.getUserId()));

        Product product = productRepository.findById(rentalDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + rentalDTO.getProductId()));

        rental.setUser(user);
        rental.setProduct(product);

        rental.setStartDate(LocalDate.parse(rentalDTO.getStartDate()));
        rental.setEndDate(LocalDate.parse(rentalDTO.getEndDate()));

        if (rentalDTO.getReturnedDate() != null) {
            rental.setReturnedDate(LocalDate.parse(rentalDTO.getReturnedDate()));
        }

        rental.setStatus(Rental.RentalStatus.valueOf(rentalDTO.getStatus()));
        rental.setRentalFee(rentalDTO.getRentalFee());

        if (rentalDTO.getCreatedAt() != null)
            rental.setCreatedAt(LocalDateTime.parse(rentalDTO.getCreatedAt()));

        if (rentalDTO.getUpdatedAt() != null)
            rental.setUpdatedAt(LocalDateTime.parse(rentalDTO.getUpdatedAt()));

        return rental;
    }
}
