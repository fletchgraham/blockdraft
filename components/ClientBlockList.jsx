// components/ClientBlockList.jsx
"use client";

import ClientBlockItem from "./ClientBlockItem";

export default function ClientBlockList({
  blocks,
  title,
  onMove,
  lists,
  currentListId,
}) {
  return (
    <div className="client-block-list">
      <h2 className="text-center font-bold mb-2">{title}</h2>
      <ul>
        {blocks.map((block) => (
          <ClientBlockItem
            key={block._id}
            block={block}
            onMove={onMove}
            lists={lists}
            currentListId={currentListId}
          />
        ))}
      </ul>
    </div>
  );
}
