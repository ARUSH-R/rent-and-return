package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.create(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, updatedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.softDeleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category
    ) {
        if (name != null && category != null) {
            // Combine both filters if both are present
            return ResponseEntity.ok(
                productService.findByCategory(category)
                    .stream()
                    .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
                    .toList()
            );
        } else if (category != null) {
            return ResponseEntity.ok(productService.findByCategory(category));
        } else if (name != null) {
            return ResponseEntity.ok(productService.searchByName(name));
        } else {
            return ResponseEntity.ok(productService.findAll());
        }
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Product> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available
    ) {
        Product updated = productService.updateAvailability(id, available);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        return ResponseEntity.ok(productService.findAvailable());
    }
}
