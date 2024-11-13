// components/BlockEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");

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
    return () => clearInterval(intervalId);
  }, [drafts]);

  const handleOpenDraft = (draftId) => {
    setDraft(drafts.find((draft) => draft._id === draftId));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      if (source.droppableId === "inbox") {
        const reorderedBlocks = Array.from(inboxBlocks);
        const [movedBlock] = reorderedBlocks.splice(source.index, 1);
        reorderedBlocks.splice(destination.index, 0, movedBlock);
        setInboxBlocks(reorderedBlocks);
      } else if (source.droppableId === "draft") {
        const reorderedBlocks = Array.from(draft.blocks);
        const [movedBlock] = reorderedBlocks.splice(source.index, 1);
        reorderedBlocks.splice(destination.index, 0, movedBlock);
        setDraft({ ...draft, blocks: reorderedBlocks });
      }
    } else {
      // Moving between lists
      if (
        source.droppableId === "inbox" &&
        destination.droppableId === "draft"
      ) {
        const [movedBlock] = inboxBlocks.splice(source.index, 1);
        draft.blocks.splice(destination.index, 0, movedBlock);
        setInboxBlocks([...inboxBlocks]);
        setDraft({ ...draft, blocks: [...draft.blocks] });
      } else if (
        source.droppableId === "draft" &&
        destination.droppableId === "inbox"
      ) {
        const [movedBlock] = draft.blocks.splice(source.index, 1);
        inboxBlocks.splice(destination.index, 0, movedBlock);
        setDraft({ ...draft, blocks: [...draft.blocks] });
        setInboxBlocks([...inboxBlocks]);
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

          <div key={draft.id} className="w-1/2 flex flex-col h-full relative">
            <ClientBlockList
              blocks={draft.blocks}
              title={draft.name}
              droppableId="draft"
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
