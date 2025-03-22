package com.notes.controller;


import com.notes.entity.NotesEntity;
import com.notes.modal.responseModal.NotesRes;
import com.notes.repository.NotesRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notes")
@AllArgsConstructor
public class NotesController {

    private final NotesRepo notesRepo;

    @PostMapping("/add-note")
    public ResponseEntity<NotesRes> createNote(@RequestBody NotesEntity note){

        NotesRes notesRes = new NotesRes();
        notesRes.setTitle(note.getTitle());
        notesRes.setDescription(note.getDescription());

        notesRepo.save(note);
        return ResponseEntity.ok(notesRes);
    }

    @GetMapping("/get-all-notes")
    public ResponseEntity<List<NotesEntity>> getNote(){

        List<NotesEntity> allNotes = notesRepo.findAll();

        return ResponseEntity.ok(allNotes);
    }

    @PutMapping("/update-note/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody NotesEntity resNote){

        Optional<NotesEntity> optionalNote = notesRepo.findById(id);
        if(optionalNote.isPresent()){
            NotesEntity note = optionalNote.get();
            note.setTitle(resNote.getTitle());
            note.setDescription(resNote.getDescription());

            notesRepo.save(note);

            return ResponseEntity.ok(note);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
    }

    @DeleteMapping("/delete-note/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id){

        Optional<NotesEntity> optionalNote = notesRepo.findById(id);
        if(optionalNote.isPresent()){
            notesRepo.delete(optionalNote.get());

            return ResponseEntity.ok("Note has been deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");


    }
}
