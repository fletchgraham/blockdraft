"use client";

import { Droppable } from "@hello-pangea/dnd";
import BlockItem from "./BlockItem";

export default function BlockList({
  blocks,
  droppableId,
  onDeleteBlock,
  onBlockMove,
}) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="client-block-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <ul className="min-h-80">
            {blocks.map((block, index) => (
              <BlockItem
                key={block._id}
                block={block}
                index={index}
                onDeleteBlock={onDeleteBlock}
                onBlockMove={onBlockMove}
              />
            ))}
            {provided.placeholder}
            <li>
              <button
                className="btn btn-ghost shadow w-full"
                onClick={() =>
                  document.getElementById("add-block-modal-id").showModal()
                }
              >
                + New Custom Block
              </button>
            </li>
          </ul>
        </div>
      )}
    </Droppable>
  );
}
