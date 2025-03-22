package com.notes.controller;

import com.notes.jwt.JWTUtil;
import com.notes.entity.UserAccountsEntity;
import com.notes.repository.UserAccountsRepo;
import lombok.AllArgsConstructor;
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
}
