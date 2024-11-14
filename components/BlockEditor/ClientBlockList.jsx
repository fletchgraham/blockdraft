// components/ClientBlockList.jsx
"use client";

import { Droppable } from "@hello-pangea/dnd";
import ClientBlockItem from "./ClientBlockItem";

export default function ClientBlockList({ blocks, title, droppableId }) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="client-block-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="text-center font-bold mb-2">{title}</h2>
          <ul>
            {blocks.map((block, index) => (
              <ClientBlockItem key={block._id} block={block} index={index} />
            ))}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
}
