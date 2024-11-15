"use client";

import { useState, useEffect } from "react";

import { DragDropContext } from "@hello-pangea/dnd";

import ClientBlockList from "./ClientBlockList";
import BlockEditorHeader from "./BlockEditorHeader";

import {
  fetchDrafts,
  fetchInboxBlocks,
  handleDragEnd,
  syncData,
} from "./utils";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [isChanged, setIsChanged] = useState(false);

  // Fetch inbox blocks on initial load
  useEffect(() => {
    fetchInboxBlocks(setInboxBlocks);
  }, []);

  // Fetch drafts on initial load
  useEffect(() => {
    fetchDrafts(setDrafts, setDraft);
  }, []);

  // Update sync status when changes are made
  useEffect(() => {
    if (isChanged) {
      setSyncStatus("Waiting to sync...");
    }
  }, [isChanged]);

  // Update the drafts state when a draft is updated
  useEffect(() => {
    const updatedDrafts = drafts.map((d) => (d._id === draft._id ? draft : d));
    setDrafts(updatedDrafts);
  }, [draft]);

  // Sync data regularly if changes are made
  useEffect(() => {
    const intervalId = setInterval(() => {
      syncData(drafts, isChanged, setSyncStatus, setIsChanged);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [drafts, isChanged]);

  const handleOpenDraft = (draftId) => {
    setDraft(drafts.find((draft) => draft._id === draftId));
  };

  const addBlock = async (droppableId, contents) => {
    try {
      // Create a block object
      const block = {
        draftId: draft._id,
        type: "custom",
        content: contents,
      };

      // Make an API request to add the block
      const response = await fetch(`/api/blocks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([block]),
      });

      // Handle non-successful responses
      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding block:", error.message);
        alert(`Failed to add block: ${error.message}`);
        return;
      }

      // Parse the response and update the state
      const newBlocks = await response.json();
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: [newBlocks[0], ...prevDraft.blocks], // Assuming only one block is returned
      }));
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
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
      <BlockEditorHeader
        syncStatus={syncStatus}
        drafts={drafts}
        handleOpenDraft={handleOpenDraft}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 flex-1 p-4">
          <div key="inbox" className="w-1/2 flex flex-col h-full relative">
            <ClientBlockList
              blocks={inboxBlocks}
              title="Inbox"
              droppableId="inbox"
              addBlock={addBlock}
            />
          </div>

          {draft ? (
            <div className="w-1/2 flex flex-col h-full relative">
              <ClientBlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                addBlock={addBlock}
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
