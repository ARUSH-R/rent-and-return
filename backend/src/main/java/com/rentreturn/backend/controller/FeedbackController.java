package com.rentreturn.backend.controller;

import com.rentreturn.backend.model.Feedback;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.service.FeedbackService;
import com.rentreturn.backend.service.ProductService;
import com.rentreturn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserService userService;
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment
    ) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        Feedback feedback = feedbackService.addFeedback(user, product, rating, comment);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedback(@PathVariable Long id) {
        return feedbackService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.findAll());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByProduct(@PathVariable Long productId) {
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        return ResponseEntity.ok(feedbackService.findByProduct(product));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByUser(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return ResponseEntity.ok(feedbackService.findByUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable Long id,
            @RequestParam int rating,
            @RequestParam(required = false) String comment
    ) {
        Feedback updated = feedbackService.updateFeedback(id, rating, comment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/positive")
    public ResponseEntity<Boolean> isPositive(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.isPositive(id));
    }

    @PutMapping("/{id}/anonymize")
    public ResponseEntity<Feedback> anonymize(@PathVariable Long id) {
        Feedback feedback = feedbackService.anonymize(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{id}/anonymize-completely")
    public ResponseEntity<Feedback> anonymizeCompletely(@PathVariable Long id) {
        Feedback feedback = feedbackService.anonymizeCompletely(id);
        return ResponseEntity.ok(feedback);
    }
}
