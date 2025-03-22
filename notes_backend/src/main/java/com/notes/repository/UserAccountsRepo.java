package com.notes.repository;

import com.notes.entity.UserAccountsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountsRepo extends JpaRepository<UserAccountsEntity, Long> {

    UserAccountsEntity findByUsername(String username);
}
