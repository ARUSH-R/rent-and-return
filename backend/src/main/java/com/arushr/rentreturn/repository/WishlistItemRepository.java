package com.arushr.rentreturn.repository;

import com.arushr.rentreturn.model.WishlistItem;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
} 