package com.arushr.rentreturn.repository;

import com.arushr.rentreturn.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Product> findAllByDeletedFalse();

    List<Product> findAllByCategoryIgnoreCase(String category);

    List<Product> findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    List<Product> findAllByAvailableTrueAndDeletedFalse();

    List<Product> findAllByCreatedBy(String createdBy);

    long countByDeletedFalse();

    long countByCategoryIgnoreCase(String category);

    List<Product> findTop5ByDeletedFalseOrderByCreatedAtDesc();

    List<Product> findTop5ByDeletedFalseOrderByUpdatedAtDesc();

    List<Product> findByCategoryIgnoreCaseAndDeletedFalse(String category);

    List<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name);

    List<Product> findByOwnerIdAndDeletedFalse(Long ownerId);

    List<Product> findAllByDeleted(boolean deleted);

    long countByAvailableTrueAndDeletedFalse();
}
