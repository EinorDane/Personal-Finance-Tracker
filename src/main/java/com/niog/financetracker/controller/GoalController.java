package com.niog.financetracker.controller;

import com.niog.financetracker.model.Goal;
import com.niog.financetracker.model.User;
import com.niog.financetracker.repository.GoalRepository;
import com.niog.financetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Goal> getGoals(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return goalRepository.findByUser(user);
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal goal, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        goal.setId(id);
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Goal goal = goalRepository.findById(id).orElseThrow();
        if (!goal.getUser().equals(user)) {
            throw new RuntimeException("You are not authorized to delete this goal");
        }
        goalRepository.deleteById(id);
    }
}