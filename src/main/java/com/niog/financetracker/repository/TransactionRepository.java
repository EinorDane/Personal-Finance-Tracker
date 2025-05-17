package com.niog.financetracker.repository;

import com.niog.financetracker.model.Transaction;
import com.niog.financetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
}