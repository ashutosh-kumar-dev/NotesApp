package com.notes.controller;

import com.notes.jwt.JWTUtil;
import com.notes.entity.UserAccountsEntity;
import com.notes.repository.UserAccountsRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final UserAccountsRepo userAccountsRepo;
    private JWTUtil jwtUtil;

    @GetMapping("/login")
    public Map<String, String> login(Authentication authentication){

        String jwt = jwtUtil.generateToken(authentication.getName());

        return Map.of("Jwt", jwt);
    }

    @PostMapping("/signup")
    public String createUser(@RequestBody UserAccountsEntity userAccounts){

        if(userAccountsRepo.findByUsername(userAccounts.getUsername()) == null){

            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userAccounts.setPassword(passwordEncoder.encode(userAccounts.getPassword()));
            userAccountsRepo.save(userAccounts);
            return "User created Successfully";
        }

        return "User already Exist, use different username";

    }
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateJwt(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String jwt = authHeader.substring(7);
        try {
            boolean isValid = jwtUtil.validateToken(jwt);
            return ResponseEntity.ok(Map.of("valid", isValid));
        } catch (io.jsonwebtoken.JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
        }
    }
}
