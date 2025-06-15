package com.rentreturn.backend.repository;

import com.rentreturn.backend.model.Feedback;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProduct(Product product);
    List<Feedback> findByUser(User user);
}
