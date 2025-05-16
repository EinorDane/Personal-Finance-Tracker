package com.niog.financetracker.controller;

import com.niog.financetracker.model.Budget;
import com.niog.financetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    @Autowired
    private BudgetRepository repo;

    @GetMapping
    public List<Budget> getAll() { return repo.findAll(); }

    @PostMapping
    public Budget create(@RequestBody Budget budget) { return repo.save(budget); }
}