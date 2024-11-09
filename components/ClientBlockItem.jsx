// components/ClientBlockItem.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

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
      {block.thumbnailUrl && (
        <Image
          src={block.thumbnailUrl}
          alt="Thumbnail"
          width={64}
          height={64}
          className="object-cover rounded-md mr-4"
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

      {/* Move Dropdown */}
      <select
        value={selectedListId}
        onChange={(e) => setSelectedListId(e.target.value)}
        className="mx-2"
      >
        <option value="">Move to...</option>
        {lists
          .filter((list) => list.id !== currentListId) // Exclude the current list
          .map((list) => (
            <option key={list.id} value={list.id}>
              {`List ${list.id}`}
            </option>
          ))}
      </select>
      <button onClick={handleMove} className="btn btn-primary btn-sm">
        Move
      </button>
    </li>
  );
}
