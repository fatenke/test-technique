import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../services/api";

export default function AddNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleError("");
    setSubmitError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setTitleError("Title is required.");
      return;
    }

    setSubmitting(true);

    try {
      await createNote({ title: title.trim(), description: description.trim() });
      setSuccessMessage("Note added successfully!");
      setTitle("");
      setDescription("");

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-section">
      <h2 className="page-title">Add a New Note</h2>

      {successMessage && (
        <p className="alert alert-success">{successMessage}</p>
      )}

      {submitError && <p className="alert alert-error">{submitError}</p>}

      <form className="note-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            className={titleError ? "input-error" : ""}
          />
          {titleError && <span className="field-error">{titleError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter note description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-success"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
