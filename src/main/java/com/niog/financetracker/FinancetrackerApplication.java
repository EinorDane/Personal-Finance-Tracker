package com.niog.financetracker;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.niog.financetracker.model.Category;
import com.niog.financetracker.repository.CategoryRepository;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;

@SpringBootApplication(scanBasePackages = "com.niog.financetracker")
public class FinancetrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancetrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.save(new Category("Food"));
                categoryRepository.save(new Category("Rent"));
                categoryRepository.save(new Category("Utilities"));
                categoryRepository.save(new Category("Transportation"));
                categoryRepository.save(new Category("Health"));
                categoryRepository.save(new Category("Entertainment"));
                categoryRepository.save(new Category("Savings"));
                categoryRepository.save(new Category("Investments"));
            }
        };
    }
}