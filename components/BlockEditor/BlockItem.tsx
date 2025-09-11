"use client";

import { Draggable } from "@hello-pangea/dnd";
import AreYouSureModal from "@/components/AreYouSureModal";
import { BlockMenu } from "./BlockMenu";

export default function BlockItem({
  block,
  index,
  onDeleteBlock,
  onEditBlock,
  onBlockMove,
  onBlockMoveToTop,
  onBlockMoveToPreviousSection,
  onBlockMoveToNextSection,
  onBlockMoveToBottom,
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
                <div>
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline break-all line-clamp-2"
                  >
                    {block.title}
                  </a>
                </div>
                {block.contentDate && (
                  <time
                    dateTime={block.contentDate}
                    className="text-xs text-gray-500"
                  >
                    {new Date(block.contentDate).toLocaleDateString()}
                  </time>
                )}
              </div>
            </div>
            <BlockMenu
              block={block}
              onEditBlock={onEditBlock}
              onBlockMove={onBlockMove}
              deleteModalId={deleteModalId}
              onBlockMoveToTop={onBlockMoveToTop}
              onBlockMoveToPreviousSection={onBlockMoveToPreviousSection}
              onBlockMoveToNextSection={onBlockMoveToNextSection}
              onBlockMoveToBottom={onBlockMoveToBottom}
            />
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
