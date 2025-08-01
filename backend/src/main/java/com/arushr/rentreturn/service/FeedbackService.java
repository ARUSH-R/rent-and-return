package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Feedback;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;

import java.util.List;
import java.util.Optional;

public interface FeedbackService {

    Feedback addFeedback(User user, Product product, int rating, String comment);

    Optional<Feedback> findById(Long id);

    List<Feedback> findAll();

    List<Feedback> findByProduct(Product product);

    List<Feedback> findByUser(User user);

    Feedback updateFeedback(Long id, int newRating, String newComment);

    void deleteFeedback(Long id);

    boolean isPositive(Long id);

    Feedback anonymize(Long id);

    Feedback anonymizeCompletely(Long id);
}
