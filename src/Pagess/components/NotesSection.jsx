import React, { useState } from "react";
import styles from "./NotesSection.module.css";

const NotesSection = ({ onAddNote }) => {
  const [note, setNote] = useState("");
  return (
    <div className={styles.notes}>
      <textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
      <button
        onClick={() => {
          onAddNote(note);
          setNote("");
        }}
      >
        Add Note
      </button>
    </div>
  );
};

export default NotesSection;
