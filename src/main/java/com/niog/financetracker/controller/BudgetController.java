package com.niog.financetracker.controller;

import com.niog.financetracker.model.Budget;
import com.niog.financetracker.model.User;
import com.niog.financetracker.repository.BudgetRepository;
import com.niog.financetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Budget> getBudgets(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return budgetRepository.findByUser(user);
    }

    @PostMapping
    public Budget addBudget(@RequestBody Budget budget, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id, @RequestBody Budget budget, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        budget.setId(id);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Budget budget = budgetRepository.findById(id).orElseThrow();
        if (!budget.getUser().equals(user)) {
            throw new RuntimeException("You are not authorized to delete this budget");
        }
        budgetRepository.deleteById(id);
    }
}