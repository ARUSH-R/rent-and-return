package com.rentreturn.backend.repository;

import com.rentreturn.backend.model.CartItem;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    List<CartItem> findByUserId(Long userId);

    void deleteAllByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    List<CartItem> findByUserAndReservedTrue(User user);

    long countByUser(User user);

    List<CartItem> findAllByProduct(Product product);

    List<CartItem> findAllByReservedTrue();

    long countByReservedTrue();

    List<CartItem> findByUserAndReservedFalse(User user);
}
