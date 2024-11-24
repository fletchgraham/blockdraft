"use client";
import { useState } from "react";

export default function AddBlockModal({ onAddBlock }) {
  const [newBlockContent, setNewBlockContent] = useState(""); // New state for block content
  const modalId = "add-block-modal-id";

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (newBlockContent.trim()) {
      onAddBlock(newBlockContent); // Add the block to the draft
      setNewBlockContent(""); // Reset input field
      document.getElementById(modalId).close(); // Close the modal
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add a New Custom Block</h3>
        <form onSubmit={handleAddBlock} className="py-4">
          <input
            type="text"
            placeholder="Enter block content"
            className="input input-bordered w-full mb-4"
            value={newBlockContent}
            onChange={(e) => setNewBlockContent(e.target.value)}
            required
          />
          <div className="modal-action">
            <button type="submit" className="btn">
              Add Block
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => document.getElementById(modalId).close()}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
