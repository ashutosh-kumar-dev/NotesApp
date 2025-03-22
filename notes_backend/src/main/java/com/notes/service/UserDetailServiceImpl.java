package com.notes.service;

import com.notes.entity.UserAccountsEntity;
import com.notes.repository.UserAccountsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserAccountsRepo userAccountsRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserAccountsEntity user = userAccountsRepo.findByUsername(username);

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }
}
