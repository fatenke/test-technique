package tn.esprit.backend.services;

import tn.esprit.backend.entities.Note;

import java.util.List;

public interface INoteService {
    Note addNote(Note note);
    List<Note> getNotes();
    void deleteNote(Long id);

}
