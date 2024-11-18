"use client";

import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import BlockItem from "./BlockItem";

export default function BlockList({ blocks, title, droppableId, addBlock }) {
  const [newBlockContent, setNewBlockContent] = useState(""); // New state for block content
  const newBlockModalId = `newBlockModal-${droppableId}`;

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (newBlockContent.trim()) {
      addBlock(newBlockContent); // Add the block to the draft
      setNewBlockContent(""); // Reset input field
      document.getElementById(newBlockModalId).close(); // Close the modal
    }
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="client-block-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="text-center font-bold mb-2">{title}</h2>
          <ul className="min-h-80">
            {blocks.map((block, index) => (
              <BlockItem key={block._id} block={block} index={index} />
            ))}
            {provided.placeholder}
            <li>
              <button
                className="btn btn-ghost shadow w-full"
                onClick={() =>
                  document.getElementById(newBlockModalId).showModal()
                }
              >
                + New Custom Block
              </button>
            </li>
          </ul>

          {/* Modal for adding a new block */}
          <dialog id={newBlockModalId} className="modal">
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
                    onClick={() =>
                      document.getElementById(newBlockModalId).close()
                    }
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      )}
    </Droppable>
  );
}
