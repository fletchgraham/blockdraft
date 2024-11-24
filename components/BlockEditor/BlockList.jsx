"use client";

import { Droppable } from "@hello-pangea/dnd";
import BlockItem from "./BlockItem";

export default function BlockList({
  blocks,
  droppableId,
  onDeleteBlock,
  onEditBlock,
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
                onEditBlock={onEditBlock}
                onBlockMove={onBlockMove}
              />
            ))}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
}
