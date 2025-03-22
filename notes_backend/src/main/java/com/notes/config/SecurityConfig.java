package com.notes.config;

import com.notes.jwt.JWTFilter;
import com.notes.service.UserDetailServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private JWTFilter jwtFilter;
    private UserDetailServiceImpl userDetailServiceImpl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf->csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/notes/**").authenticated()
                                .requestMatchers("auth/signup", "auth/login").permitAll()
                        )
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailServiceImpl).passwordEncoder(passwordEncoder());

        return authBuilder.build();
    }
}
