package com.rentreturn.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private int rating;

    private String comment;

    private boolean anonymous;

    public boolean isPositive() {
        return this.rating >= 4;
    }

    public void anonymize() {
        this.anonymous = true;
    }

    public void anonymizeCompletely() {
        this.anonymous = true;
        this.user = null;
    }
}
