package com.rentreturn.backend.service;

import com.rentreturn.backend.model.CartItem;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface CartItemService {

    CartItem addItem(User user, Product product, int quantity);

    Optional<CartItem> findById(Long id);

    List<CartItem> findByUser(User user);

    CartItem updateQuantity(Long cartItemId, int newQuantity);

    void removeItem(Long cartItemId);

    void clearCart(User user);

    boolean isItemInCart(User user, Product product);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    CartItem reserveItem(Long cartItemId);

    void unreserveItem(Long cartItemId);

    void clearReservations(User user);

    long countItemsInCart(User user);


}
