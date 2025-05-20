package com.rentreturn.backend.service;

import com.rentreturn.backend.model.Product;
import java.util.List;

public interface ProductService {

    Product addProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(int id);

    Product updateProduct(int id, Product updateProduct);

    void deleteProduct(int id);


}
