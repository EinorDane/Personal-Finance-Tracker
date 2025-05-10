package com.niog.financetracker.controller;

import com.niog.financetracker.model.Transaction;
import com.niog.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionRepository repo;

    @GetMapping
    public List<Transaction> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return repo.save(transaction);
    }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody Transaction transaction) {
        transaction.setId(id);
        return repo.save(transaction);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}