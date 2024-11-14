// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import ClientBlockList from "./ClientBlockList";
import Link from "next/link";

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
        const response = await fetch("/api/blocks2");
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
    const { source, destination } = result;

    // If there’s no destination (e.g., item was dragged out of the list), do nothing
    if (!destination) return;

    setIsChanged(true);

    // If the source and destination lists are the same, handle reordering within that list
    if (source.droppableId === destination.droppableId) {
      // Check if the move is within the "inbox" list
      if (source.droppableId === "inbox") {
        // Create a new copy of the inboxBlocks array
        const reorderedInboxBlocks = Array.from(inboxBlocks);

        // Remove the item from its original position and insert it at the new index
        const [movedBlock] = reorderedInboxBlocks.splice(source.index, 1);
        reorderedInboxBlocks.splice(destination.index, 0, movedBlock);

        // Update the state with the new order for inboxBlocks
        setInboxBlocks(reorderedInboxBlocks);
      }
      // Check if the move is within the "draft" list
      else if (source.droppableId === "draft") {
        // Create a new copy of the draft.blocks array
        const reorderedDraftBlocks = Array.from(draft.blocks);

        // Remove the item from its original position and insert it at the new index
        const [movedBlock] = reorderedDraftBlocks.splice(source.index, 1);
        reorderedDraftBlocks.splice(destination.index, 0, movedBlock);

        // Update the draft with the reordered blocks
        setDraft({ ...draft, blocks: reorderedDraftBlocks });
      }
    }
    // If moving items between different lists, handle accordingly
    else {
      // Moving from "inbox" to "draft"
      if (
        source.droppableId === "inbox" &&
        destination.droppableId === "draft"
      ) {
        // Create a copy of both the inbox and draft blocks arrays
        const newInboxBlocks = Array.from(inboxBlocks);
        const newDraftBlocks = Array.from(draft.blocks);

        // Remove the item from inbox and add it to draft at the specified index
        const [movedBlock] = newInboxBlocks.splice(source.index, 1);
        newDraftBlocks.splice(destination.index, 0, movedBlock);

        // Update both inboxBlocks and draft.blocks states to reflect the new positions
        setInboxBlocks(newInboxBlocks);
        setDraft({ ...draft, blocks: newDraftBlocks });
      }
      // Moving from "draft" to "inbox"
      else if (
        source.droppableId === "draft" &&
        destination.droppableId === "inbox"
      ) {
        // Create a copy of both the draft and inbox blocks arrays
        const newDraftBlocks = Array.from(draft.blocks);
        const newInboxBlocks = Array.from(inboxBlocks);

        // Remove the item from draft and add it to inbox at the specified index
        const [movedBlock] = newDraftBlocks.splice(source.index, 1);
        newInboxBlocks.splice(destination.index, 0, movedBlock);

        // Update both draft.blocks and inboxBlocks states to reflect the new positions
        setDraft({ ...draft, blocks: newDraftBlocks });
        setInboxBlocks(newInboxBlocks);
      }
    }
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
