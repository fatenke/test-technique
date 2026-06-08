import { useCallback, useEffect, useState } from "react";
import { getNotes, deleteNote } from "../services/api";
import NoteList from "../components/NoteList";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getNotes();
      setNotes(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      await fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-section">
      <h2 className="page-title">My Notes</h2>
      <NoteList
        notes={notes}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}
