package com.niog.financetracker.controller;

import com.niog.financetracker.model.Transaction;
import com.niog.financetracker.model.User;
import com.niog.financetracker.repository.TransactionRepository;
import com.niog.financetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Transaction> getTransactions(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return transactionRepository.findByUser(user);
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody Transaction transaction, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        transaction.setId(id);
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Transaction transaction = transactionRepository.findById(id).orElseThrow();
        if (!transaction.getUser().equals(user)) {
            throw new RuntimeException("You are not authorized to delete this transaction");
        }
        transactionRepository.deleteById(id);
    }
}