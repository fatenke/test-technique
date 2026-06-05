package tn.esprit.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.backend.entities.Note;

@Repository
public interface NoteRepo extends JpaRepository<Note, Long> {
}
