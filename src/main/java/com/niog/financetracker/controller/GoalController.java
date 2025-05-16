package com.niog.financetracker.controller;

import com.niog.financetracker.model.Goal;
import com.niog.financetracker.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    @Autowired
    private GoalRepository repo;

    @GetMapping
    public List<Goal> getAll() { return repo.findAll(); }

    @PostMapping
    public Goal create(@RequestBody Goal goal) { return repo.save(goal); }
}