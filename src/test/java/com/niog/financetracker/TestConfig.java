package com.niog.financetracker;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import com.niog.financetracker.config.SecurityConfig;
import com.niog.financetracker.config.WebConfig;
import com.niog.financetracker.security.JwtUtil;
import com.niog.financetracker.service.CustomUserDetailsService;
import static org.mockito.Mockito.mock;

@TestConfiguration
@Import({SecurityConfig.class, WebConfig.class})
public class TestConfig {

    @Bean
    public JwtUtil jwtUtil() {
        return mock(JwtUtil.class);
    }


    @Bean
    public CustomUserDetailsService customUserDetailsService() {
        return mock(CustomUserDetailsService.class); // Add this
    }
}