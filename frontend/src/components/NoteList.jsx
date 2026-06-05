import NoteCard from "./NoteCard";

export default function NoteList({ notes, loading, error, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading...</p>;
  }

  if (error) {
    return <p className="status-message status-error">{error}</p>;
  }

  if (notes.length === 0) {
    return <p className="status-message">No notes found</p>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}
