package tn.esprit.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.backend.entities.Note;
import tn.esprit.backend.services.INoteService;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final INoteService iNoteService;
    @GetMapping("")
    public List<Note> getAllNotes() {
        return iNoteService.getNotes();
    }

    @PostMapping("")
    public Note addNote(@RequestBody Note note) {
        return iNoteService.addNote(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        iNoteService.deleteNote(id);
    }

}
