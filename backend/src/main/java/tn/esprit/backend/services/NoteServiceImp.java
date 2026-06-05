package tn.esprit.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.backend.entities.Note;
import tn.esprit.backend.repositories.NoteRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteServiceImp implements INoteService{
    private final NoteRepo noteRepo;

    @Override
    public List<Note> getNotes() {
        return noteRepo.findAll();
    }

    @Override
    public Note addNote(Note note) {
        return noteRepo.save(note);
    }

    @Override
    public void deleteNote(Long id) {
        noteRepo.deleteById(id);
    }

}
