package com.rentreturn.backend.repository;

import com.rentreturn.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Integer> {


}
