// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);

  // Fetch blocks from API on component mount
  useEffect(() => {
    async function inboxBlocks() {
      try {
        const response = await fetch("/api/blocks2");
        const data = await response.json();
        setInboxBlocks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    inboxBlocks();
  }, []);

  // Fetch drafts from API on component mount
  useEffect(() => {
    async function fetchDrafts() {
      try {
        const response = await fetch("/api/drafts");
        const data = await response.json();
        setDrafts(data);
        setDraft(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchDrafts();
  }, []);

  const [syncStatus, setSyncStatus] = useState("Synced");

  const syncData = async () => {
    setSyncStatus("Syncing...");
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts),
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

  useEffect(() => {
    const intervalId = setInterval(syncData, 10000);

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [drafts]);

  const handleOpenDraft = (draftId) => {
    console.log(`Opening draft ${draftId}`);
    setDraft(drafts.find((draft) => draft._id === draftId));
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
              <li key={draft._id} onClick={() => handleOpenDraft(draft._id)}>
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
            title={draft.name}
            onMove={(block, toListId) => moveBlock(draft.id, toListId, block)}
          />
        </div>
      </div>
    </div>
  );
}
