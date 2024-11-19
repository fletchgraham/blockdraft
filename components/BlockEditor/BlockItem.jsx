"use client";

import { Draggable } from "@hello-pangea/dnd";

export default function BlockItem({ block, index }) {
  return (
    <Draggable draggableId={block._id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps} // Apply draggableProps to the entire list item
          className="flex items-center shadow p-4 bg-base-100 rounded-lg mb-2"
        >
          <div
            {...provided.dragHandleProps}
            className="flex flex-1 items-center"
          >
            {block.type === "custom" && (
              <p className="text-lg font-semibold">{block.content}</p>
            )}
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
                className="font-semibold text-primary hover:underline"
              >
                {block.title}
              </a>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              |
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </li>
      )}
    </Draggable>
  );
}
