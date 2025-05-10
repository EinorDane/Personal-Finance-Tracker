package com.niog.financetracker.controller;

import com.niog.financetracker.security.JwtUtil;
import com.niog.financetracker.service.CustomUserDetailsService;
import com.niog.financetracker.model.User;
import com.niog.financetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            throw new Exception("Incorrect username or password");
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return new LoginResponse(jwt);
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // In real app, hash password with BCryptPasswordEncoder!
        userRepository.save(user); // For now, plain text (NOT recommended for production)
        return "User registered successfully";
    }
}

// DTOs
class AuthRequest {
    private String username;
    private String password;

    // getters/setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginResponse {
    private String jwt;
    public LoginResponse(String jwt) { this.jwt = jwt; }
    public String getJwt() { return jwt; }
}