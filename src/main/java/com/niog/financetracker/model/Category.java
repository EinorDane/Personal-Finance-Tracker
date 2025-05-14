package com.niog.financetracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Constructor for quick setup
    public Category() {
        // Default constructor (needed by Hibernate)
    }

    public Category(String name) {
        this.name = name;
    }
}