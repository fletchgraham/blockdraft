// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);
  const [lists, setLists] = useState([]);

  // Fetch blocks from API on component mount
  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch("/api/blocks2");
        const data = await response.json();
        setInboxBlocks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchBlocks();
  }, []);

  // Fetch drafts from API on component mount
  useEffect(() => {
    async function fetchDrafts() {
      try {
        const response = await fetch("/api/drafts");
        const data = await response.json();
        setDrafts(data);
        console.log(drafts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchDrafts();
  }, []);

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
        setDraft(populatedLists[0]);
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

  const handleOpenDraft = (draftId) => {
    console.log(`Opening draft ${draftId}`);
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

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            Open Draft
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu border border-black bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {drafts.map((draft) => (
              <li
                key={draft._id}
                onClick={() => handleOpenDraft(draft._id)}
                onClickclassName="menu-title"
              >
                <a>{draft.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="flex space-x-4 flex-1 p-4">
        <div key="inbox" className="w-1/2 flex flex-col h-full relative">
          <ClientBlockList
            blocks={inboxBlocks}
            title="Inbox"
            onMove={(block, toListId) => moveBlock("inbox", toListId, block)}
          />
        </div>

        <div key={draft.id} className="w-1/2 flex flex-col h-full relative">
          <ClientBlockList
            blocks={draft.blocks}
            title={draft.title}
            onMove={(block, toListId) => moveBlock(draft.id, toListId, block)}
          />
        </div>
      </div>
    </div>
  );
}
