package com.niog.financetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.niog.financetracker")
public class FinancetrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinancetrackerApplication.class, args);
    }
}