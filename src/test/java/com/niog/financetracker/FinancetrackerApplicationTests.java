package com.niog.financetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

// Add mocks for dependencies your context needs
@SpringBootTest
class FinancetrackerApplicationTests {

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @Test
    void contextLoads() {
        // Test will pass if the context loads with mocks
    }
}