"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { DragDropContext } from "@hello-pangea/dnd";

import ClientBlockList from "./ClientBlockList";
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
