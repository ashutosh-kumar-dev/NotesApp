package com.notes.repository;

import com.notes.entity.NotesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotesRepo extends JpaRepository<NotesEntity, Long> {

}
