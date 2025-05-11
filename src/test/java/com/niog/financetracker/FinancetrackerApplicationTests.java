package com.niog.financetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

// Import your services/repositories, e.g.,
import com.niog.financetracker.security.JwtUtil;
import com.niog.financetracker.repository.UserRepository;

@SpringBootTest
public class FinancetrackerApplicationTests {

    // Mock specific dependencies that are required during context load
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @Test
    void contextLoads() {
        // This test just checks if the Spring Application Context loads successfully.
    }
}