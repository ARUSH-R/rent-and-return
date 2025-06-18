package com.arushr.rentreturn.repository;

import com.arushr.rentreturn.enums.RentalStatus;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findAllByDeletedFalse();

    List<Rental> findByUserAndDeletedFalse(User user);

    List<Rental> findByProductAndDeletedFalse(Product product);

    List<Rental> findByStatus(RentalStatus status);

    List<Rental> findByUserAndStatus(User user, RentalStatus status);

    List<Rental> findByRentalStartBetween(LocalDateTime start, LocalDateTime end);

    List<Rental> findByRentalEndBeforeAndStatusNotAndDeletedFalse(LocalDateTime now, RentalStatus status);

    long countByStatus(RentalStatus status);

    long countByDeletedFalse();

    List<Rental> findAllByUserIdAndDeletedFalse(Long userId);

    List<Rental> findAllByProductIdAndDeletedFalse(Long productId);

    List<Rental> findAllByRentalEndBeforeAndStatusNotAndDeletedFalse(LocalDateTime now, RentalStatus status);

    List<Rental> findTop5ByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndProductAndStatus(User user, Product product, RentalStatus status);
}
