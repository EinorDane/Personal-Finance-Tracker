package com.niog.financetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private double amount;
    private String category; // for simplicity, just a string here
    private LocalDate date;

    private boolean recurring = false;
    private String recurrenceRule; // e.g., "monthly", "weekly"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters for user
}