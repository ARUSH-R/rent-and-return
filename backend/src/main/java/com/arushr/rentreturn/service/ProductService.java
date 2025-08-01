package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.dto.product.ProductDTO;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    Product create(Product product);
    Product create(ProductDTO productDTO);

    Optional<Product> findById(Long id);

    List<Product> findAll();

    List<Product> findAvailable();

    Product updateProduct(Long id, Product updatedProduct);
    Product updateProduct(Long id, ProductDTO productDTO);

    void softDeleteProduct(Long id);

    List<Product> findByCategory(String category);

    List<Product> searchByName(String keyword);

    List<Product> findByOwner(Long ownerId);

    List<Product> findAllByDeleted(boolean deleted);

    long countAll();

    long countAvailable();

    Product updateAvailability(Long id, boolean available);
}
