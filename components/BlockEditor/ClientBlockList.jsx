// components/ClientBlockList.jsx
"use client";

import { Droppable } from "@hello-pangea/dnd";
import ClientBlockItem from "./ClientBlockItem";

export default function ClientBlockList({ blocks, title, droppableId }) {
  const newBlockModalId = `newBlockModal-${droppableId}`;
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
              <ClientBlockItem key={block._id} block={block} index={index} />
            ))}
            {provided.placeholder}
            <li>
              <button
                className="btn btn-ghost shadow w-full"
                onClick={() =>
                  document.getElementById(newBlockModalId).showModal()
                }
              >
                + New Block
              </button>
            </li>
          </ul>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <dialog id={newBlockModalId} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </Droppable>
  );
}
