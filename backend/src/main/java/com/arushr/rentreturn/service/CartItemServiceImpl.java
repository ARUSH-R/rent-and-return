package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.CartItem;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.CartItemRepository;
import com.arushr.rentreturn.service.CartItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem addItem(User user, Product product, int quantity) {
        Optional<CartItem> existing = cartItemRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        CartItem item = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .reserved(false)
                .build();
        return cartItemRepository.save(item);
    }

    @Override
    public Optional<CartItem> findById(Long id) {
        return cartItemRepository.findById(id);
    }

    @Override
    public List<CartItem> findByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    @Override
    public CartItem updateQuantity(Long cartItemId, int newQuantity) {
        return cartItemRepository.findById(cartItemId).map(item -> {
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("CartItem not found"));
    }

    @Override
    public void removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public void clearCart(User user) {
        cartItemRepository.deleteAllByUser(user);
    }

    @Override
    public boolean isItemInCart(User user, Product product) {
        return cartItemRepository.existsByUserAndProduct(user, product);
    }

    @Override
    public Optional<CartItem> findByUserAndProduct(User user, Product product) {
        return cartItemRepository.findByUserAndProduct(user, product);
    }

    @Override
    public CartItem reserveItem(Long cartItemId) {
        return cartItemRepository.findById(cartItemId).map(item -> {
            item.setReserved(true);
            return cartItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("CartItem not found"));
    }

    @Override
    public void unreserveItem(Long cartItemId) {
        cartItemRepository.findById(cartItemId).ifPresent(item -> {
            item.setReserved(false);
            cartItemRepository.save(item);
        });
    }

    @Override
    public void clearReservations(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        for (CartItem item : items) {
            item.setReserved(false);
        }
        cartItemRepository.saveAll(items);
    }

    @Override
    public long countItemsInCart(User user) {
        return cartItemRepository.countByUser(user);
    }
}
