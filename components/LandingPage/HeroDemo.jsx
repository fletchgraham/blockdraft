"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function HeroDemo() {
  const [blocks, setBlocks] = useState([
    { id: "1", heading: "Block 1", content: "This is the first block." },
    { id: "2", heading: "Block 2", content: "This is the second block." },
    { id: "3", heading: "Block 3", content: "This is the third block." },
  ]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // Exit if dropped outside a valid droppable

    // Rearrange the blocks
    const reorderedBlocks = Array.from(blocks);
    const [movedBlock] = reorderedBlocks.splice(source.index, 1);
    reorderedBlocks.splice(destination.index, 0, movedBlock);

    setBlocks(reorderedBlocks);
  };

  return (
    <div className="w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className=""
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 bg-base-100 rounded-md shadow mb-2"
                    >
                      <h2 className="font-bold text-lg">{block.heading}</h2>
                      <p>{block.content}</p>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
