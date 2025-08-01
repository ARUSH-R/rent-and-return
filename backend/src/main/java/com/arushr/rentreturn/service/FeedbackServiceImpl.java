package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Feedback;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.FeedbackRepository;
import com.arushr.rentreturn.exception.BusinessRuleException;
import com.arushr.rentreturn.repository.RentalRepository;
import com.arushr.rentreturn.enums.RentalStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final RentalRepository rentalRepository;

    @Override
    public Feedback addFeedback(User user, Product product, int rating, String comment) {
        // Only allow feedback if user has returned the product
        boolean hasReturned = rentalRepository.existsByUserIdAndProductIdAndStatusAndDeletedFalse(
            user.getId(), product.getId(), RentalStatus.RETURNED
        );
        if (!hasReturned) {
            throw new BusinessRuleException("You can only leave feedback after returning the product.");
        }
        // Prevent duplicate feedback for the same product by the same user
        boolean alreadyRated = feedbackRepository.existsByUserAndProduct(user, product);
        if (alreadyRated) {
            throw new BusinessRuleException("You have already rated this product.");
        }
        Feedback feedback = Feedback.builder()
                .user(user)
                .product(product)
                .rating(rating)
                .comment(comment)
                .anonymous(false)
                .build();
        return feedbackRepository.save(feedback);
    }

    @Override
    public Optional<Feedback> findById(Long id) {
        return feedbackRepository.findById(id);
    }

    @Override
    public List<Feedback> findAll() {
        return feedbackRepository.findAll();
    }

    @Override
    public List<Feedback> findByProduct(Product product) {
        return feedbackRepository.findByProduct(product);
    }

    @Override
    public List<Feedback> findByUser(User user) {
        return feedbackRepository.findByUser(user);
    }

    @Override
    public Feedback updateFeedback(Long id, int newRating, String newComment) {
        return feedbackRepository.findById(id).map(fb -> {
            fb.setRating(newRating);
            fb.setComment(newComment);
            return feedbackRepository.save(fb);
        }).orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    @Override
    public boolean isPositive(Long id) {
        return feedbackRepository.findById(id)
                .map(f -> f.getRating() >= 4)
                .orElse(false);
    }

    @Override
    public Feedback anonymize(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedback.setAnonymous(true);
        return feedbackRepository.save(feedback);
    }

    @Override
    public Feedback anonymizeCompletely(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedback.setAnonymous(true);
        feedback.setUser(null);
        return feedbackRepository.save(feedback);
    }
}
