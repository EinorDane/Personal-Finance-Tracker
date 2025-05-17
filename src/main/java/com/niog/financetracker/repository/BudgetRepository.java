package com.niog.financetracker.repository;

import com.niog.financetracker.model.Budget;
import com.niog.financetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
}

