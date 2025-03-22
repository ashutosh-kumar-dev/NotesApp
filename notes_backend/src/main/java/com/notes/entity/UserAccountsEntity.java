package com.notes.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class UserAccountsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String password;


}
