// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import ClientBlockList from "./ClientBlockList";
import Link from "next/link";
import { handleDragEnd } from "./utils";

const syncData = async (drafts, isChanged, setSyncStatus, setIsChanged) => {
  if (!isChanged) return;

  setSyncStatus("Syncing...");
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts),
    });
    if (response.ok) {
      setSyncStatus("Synced");
      setIsChanged(false); // Reset isChanged here to avoid re-syncing
    } else {
      setSyncStatus("Failed to sync");
    }
  } catch (error) {
    console.error("Sync error:", error);
    setSyncStatus("Failed to sync");
  }
};

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    async function fetchInboxBlocks() {
      try {
        const response = await fetch("/api/blocks");
        const data = await response.json();
        setInboxBlocks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchInboxBlocks();
  }, []);

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

  // effect to update sync status when there's a change
  useEffect(() => {
    if (isChanged) {
      setSyncStatus("Waiting to sync...");
    }
  }, [isChanged]);

  // an effect to update drafts when draft is updated
  useEffect(() => {
    const updatedDrafts = drafts.map((d) => (d._id === draft._id ? draft : d));
    setDrafts(updatedDrafts);
  }, [draft]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      syncData(drafts, isChanged, setSyncStatus, setIsChanged);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [drafts, isChanged]);

  const handleOpenDraft = (draftId) => {
    setDraft(drafts.find((draft) => draft._id === draftId));
  };

  const onDragEnd = (result) => {
    handleDragEnd(
      result,
      setIsChanged,
      inboxBlocks,
      setInboxBlocks,
      draft,
      setDraft
    );
  };

  return (
    <div className="block-editor-container h-screen flex flex-col">
      <header className="flex justify-between items-center p-2 border-b border-black">
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
            <li key="new">
              <Link href="/drafts/create">+ New Draft</Link>
            </li>
          </ul>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 flex-1 p-4">
          <div key="inbox" className="w-1/2 flex flex-col h-full relative">
            <ClientBlockList
              blocks={inboxBlocks}
              title="Inbox"
              droppableId="inbox"
            />
          </div>

          {draft ? (
            <div key={draft.id} className="w-1/2 flex flex-col h-full relative">
              <ClientBlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
              />
            </div>
          ) : (
            <p>No Drafts.</p>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
