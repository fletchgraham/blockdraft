// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [lists, setLists] = useState([]);

  // components/BlockEditor.jsx
  const [syncStatus, setSyncStatus] = useState("Synced");

  const syncData = async () => {
    setSyncStatus("Syncing...");
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lists),
      });
      if (response.ok) {
        setSyncStatus("Synced");
      } else {
        setSyncStatus("Failed to sync");
      }
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("Failed to sync");
    }
  };

  // Fetch lists and blocks from API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const listsResponse = await fetch("/api/lists");
        const blocksResponse = await fetch("/api/blocks");
        const listsData = await listsResponse.json();
        const blocksData = await blocksResponse.json();

        // Transform lists to include block details
        const blocksMap = blocksData.reduce((acc, block) => {
          acc[block._id] = block;
          return acc;
        }, {});

        const populatedLists = listsData.map((list) => ({
          ...list,
          blocks: list.blockIds.map((id) => blocksMap[id]),
        }));

        setLists(populatedLists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // components/BlockEditor.jsx
  useEffect(() => {
    const intervalId = setInterval(syncData, 10000);

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [lists]);

  const addList = () => {
    setLists((prevLists) => [
      ...prevLists,
      { id: `list${prevLists.length + 1}`, blocks: [] },
    ]);
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
      <header className="flex justify-between items-center p-2 border-b border-black">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden"
        >
          <div className="space-y-2">
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
          </div>
        </label>
        <h2 className="text-center font-semibold">Block Editor</h2>
        <span>{syncStatus}</span>
        <button onClick={addList} className="btn btn-primary">
          Add List
        </button>
      </header>

      <div className="flex space-x-4 flex-1 p-4">
        {lists.map((list) => (
          <div key={list.id} className="w-1/3 flex flex-col h-full relative">
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
