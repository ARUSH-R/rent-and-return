package com.arushr.rentreturn.repository;

import com.arushr.rentreturn.model.Feedback;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProduct(Product product);
    List<Feedback> findByUser(User user);
}
