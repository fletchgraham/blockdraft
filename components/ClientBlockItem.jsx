// components/ClientBlockItem.jsx
"use client";

import { Draggable } from "@hello-pangea/dnd";

export default function ClientBlockItem({ block, index }) {
  return (
    <Draggable draggableId={block._id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center shadow p-4 bg-base-100 rounded-lg mb-2"
        >
          {block.thumbnailUrl && (
            <img
              src={block.thumbnailUrl}
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
          )}
          <div className="flex-1">
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-primary hover:underline"
            >
              {block.title}
            </a>
            <p className="text-sm text-gray-500">{block.text}</p>
          </div>
        </li>
      )}
    </Draggable>
  );
}
