package com.niog.financetracker.repository;

import com.niog.financetracker.model.Goal;
import com.niog.financetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}