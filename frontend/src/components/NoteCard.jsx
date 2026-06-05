export default function NoteCard({ note, onDelete }) {
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?`
    );
    if (confirmed) {
      onDelete(note.idNote);
    }
  };

  return (
    <article className="note-card">
      <div className="note-card-content">
        <h3 className="note-card-title">{note.title}</h3>
        {note.description && (
          <p className="note-card-description">{note.description}</p>
        )}
      </div>
      <button type="button" className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </article>
  );
}
