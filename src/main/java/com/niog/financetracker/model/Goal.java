package com.niog.financetracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double target;
    private double saved;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}