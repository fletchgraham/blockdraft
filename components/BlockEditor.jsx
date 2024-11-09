// components/BlockEditor.jsx
"use client";

import { useState } from "react";
import ClientBlockList from "./ClientBlockList";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for each list

export default function BlockEditor() {
  const [lists, setLists] = useState([{ id: uuidv4(), blocks: [] }]);

  // Add a new list
  const addList = () => {
    setLists([...lists, { id: uuidv4(), blocks: [] }]);
  };

  // Remove a list by ID
  const removeList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  // Move a block from one list to another
  const moveBlock = (fromListId, toListId, block) => {
    setLists((prevLists) => {
      return prevLists.map((list) => {
        if (list.id === fromListId) {
          return {
            ...list,
            blocks: list.blocks.filter((b) => b._id !== block._id),
          };
        }
        if (list.id === toListId) {
          return { ...list, blocks: [...list.blocks, block] };
        }
        return list;
      });
    });
  };

  return (
    <div className="block-editor-container">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-center font-semibold">Block Editor</h2>
        <button onClick={addList} className="btn btn-primary">
          Add List
        </button>
      </header>
      <div className="flex space-x-4">
        {lists.map((list) => (
          <div key={list.id} className="w-1/3 relative">
            <button
              onClick={() => removeList(list.id)}
              className="absolute top-0 right-0 m-2 text-gray-500 hover:text-red-600"
            >
              X
            </button>
            <ClientBlockList
              blocks={list.blocks}
              title={`List ${list.id}`}
              onMove={(block) => moveBlock(list.id, /* toListId */ null, block)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
