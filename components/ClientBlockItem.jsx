// components/ClientBlockItem.jsx
"use client";

import { useState } from "react";

export default function ClientBlockItem({
  block,
  onMove,
  lists,
  currentListId,
}) {
  const [selectedListId, setSelectedListId] = useState("");

  const handleMove = () => {
    if (selectedListId && selectedListId !== currentListId) {
      onMove(block, selectedListId);
      setSelectedListId(""); // Reset after move
    }
  };

  return (
    <li className="flex items-center p-4 bg-base-100 shadow rounded-lg mb-2">
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
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          M
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {lists.map((draft) => (
            <li key={draft.id}>
              <button onClick={handleMove}>{draft.id}</button>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
