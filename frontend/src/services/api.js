import axios from "axios";

const API_URL = "/api/notes";

export const getNotes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw new Error("Failed to fetch notes. Please try again later.");
  }
};

export const createNote = async (note) => {
  try {
    const response = await axios.post(API_URL, note);
    return response.data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw new Error("Failed to create note. Please try again.");
  }
};

export const deleteNote = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw new Error("Failed to delete note. Please try again.");
  }
};
