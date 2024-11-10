// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    setLists([
      {
        id: uuidv4(),
        blocks: [
          {
            _id: "1",
            title: "Sample Block 1",
            text: "This is a sample block.",
            thumbnailUrl: "",
          },
          {
            _id: "2",
            title: "Sample Block 2",
            text: "Another sample block.",
            thumbnailUrl: "",
          },
        ],
      },
      {
        id: uuidv4(),
        blocks: [
          {
            _id: "3",
            title: "Sample Block 3",
            text: "Yet another sample block.",
            thumbnailUrl: "",
          },
        ],
      },
    ]);
  }, []);

  const addList = () => {
    setLists((prevLists) => [...prevLists, { id: uuidv4(), blocks: [] }]);
  };

  const removeList = (id) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
  };

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
    <div className="block-editor-container h-screen flex flex-col">
      <header className="flex justify-between items-center p-4">
        <h2 className="text-center font-semibold">Block Editor</h2>
        <button onClick={addList} className="btn btn-primary">
          Add List
        </button>
      </header>
      <div className="flex space-x-4 flex-1 overflow-y-hidden p-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="w-1/3 flex flex-col border-2 h-full relative"
          >
            <button
              onClick={() => removeList(list.id)}
              className="absolute top-0 right-0 m-2 text-gray-500 hover:text-red-600"
            >
              X
            </button>
            <ClientBlockList
              blocks={list.blocks}
              title={`List ${list.id}`}
              onMove={(block, toListId) => moveBlock(list.id, toListId, block)}
              lists={lists}
              currentListId={list.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
