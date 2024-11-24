"use client";

import { Draggable } from "@hello-pangea/dnd";
import AreYouSureModal from "@/components/AreYouSureModal";

export default function BlockItem({
  block,
  index,
  onDeleteBlock,
  onEditBlock,
  onBlockMove,
}) {
  // make a uuid
  const deleteModalId = Math.random().toString(36).substring(7);
  return (
    <>
      <Draggable draggableId={block._id} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps} // Apply draggableProps to the entire list item
            className="flex items-center shadow bg-base-100 rounded-box mb-2 group"
          >
            <div
              {...provided.dragHandleProps}
              className="flex flex-1 items-center p-4"
            >
              {block.type === "custom" && (
                <p className="text-lg font-semibold">{block.content}</p>
              )}
              {block.thumbnailUrl && (
                <img
                  src={block.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover rounded-box mr-4"
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
            <details className="dropdown dropdown-end">
              <summary className="btn btn-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="gray"
                  viewBox="-5 0 5 24"
                  className="w-2 h-6 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
                >
                  <circle cx="0" cy="6" r="1.5" />
                  <circle cx="0" cy="12" r="1.5" />
                  <circle cx="0" cy="18" r="1.5" />
                </svg>
              </summary>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <button
                    onClick={() =>
                      onBlockMove(block, block.draftId ? "inbox" : "draft")
                    }
                  >
                    Move to {block.draftId ? "Inbox" : "Draft"}
                  </button>
                </li>
                <li>
                  <button onClick={() => onEditBlock(block)}>Edit</button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document.getElementById(deleteModalId).showModal()
                    }
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </details>
          </li>
        )}
      </Draggable>
      <AreYouSureModal
        modalId={deleteModalId}
        onConfirm={() => onDeleteBlock(block)}
      />
    </>
  );
}
