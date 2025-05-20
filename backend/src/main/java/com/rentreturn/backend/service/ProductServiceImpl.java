package com.rentreturn.backend.service;

import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product addProduct(Product product) {
        product.setAvailable(true);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product updateProduct(int id, Product updateProduct) {
        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) return null;

        existingProduct.setName(updateProduct.getName());
        existingProduct.setDescription(updateProduct.getDescription());
        existingProduct.setPrice(updateProduct.getPrice());
        existingProduct.setAvailable(updateProduct.isAvailable());
        return productRepository.save(existingProduct);

    }

    @Override
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
