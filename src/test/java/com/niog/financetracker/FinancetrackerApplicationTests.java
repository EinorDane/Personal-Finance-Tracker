package com.niog.financetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.niog.financetracker.repository.UserRepository;
import com.niog.financetracker.security.JwtUtil;

@SpringBootTest
class FinancetrackerApplicationTests {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void contextLoads() {
    }
}