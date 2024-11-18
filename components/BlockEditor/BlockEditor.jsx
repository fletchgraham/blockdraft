"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import BlockList from "./BlockList";
import BlockEditorHeader from "./BlockEditorHeader";
import { addBlock } from "@/actions/blocks";
import { handleDragEnd, syncData } from "./utils";
import { getInboxBlocks, getDraftsWithBlocks } from "@/lib/db";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState({ blocks: [] });
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [isChanged, setIsChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox"); // State for active tab

  useEffect(() => {
    const fetchData = async () => {
      const [inboxBlocks, drafts] = await Promise.all([
        getInboxBlocks(),
        getDraftsWithBlocks(),
      ]);
      setInboxBlocks(inboxBlocks);
      setDrafts(drafts);
      if (drafts.length > 0) setDraft(drafts[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isChanged) setSyncStatus("Waiting to sync...");
  }, [isChanged]);

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

  const addBlockToDraft = async (contents) => {
    try {
      const block = {
        draftId: draft._id,
        type: "custom",
        content: contents,
      };
      const newBlock = await addBlock(block);
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: [newBlock, ...prevDraft.blocks],
      }));
    } catch (error) {
      console.error("Failed to add block:", error);
      alert("An error occurred while adding the block.");
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
    <div className="flex flex-col">
      <BlockEditorHeader
        syncStatus={syncStatus}
        drafts={drafts}
        handleOpenDraft={handleOpenDraft}
      />

      {/* Tab Navigation for Small Screens */}
      <div className="flex lg:hidden justify-center border-b">
        <button
          className={`flex-1 p-2 ${
            activeTab === "inbox" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
        <button
          className={`flex-1 p-2 ${
            activeTab === "draft" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("draft")}
        >
          Draft
        </button>
      </div>

      {/* Tabbed Layout for Small Screens */}
      <div className="lg:hidden">
        {activeTab === "inbox" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full">
              <BlockList
                blocks={inboxBlocks}
                title="Inbox"
                droppableId="inbox"
                addBlock={addBlockToDraft}
              />
            </div>
          </DragDropContext>
        )}
        {activeTab === "draft" && draft && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full">
              <BlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                addBlock={addBlockToDraft}
              />
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Side-by-Side Layout for Larger Screens */}
      <div className="hidden lg:flex space-x-4 flex-1 p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div key="inbox" className="w-1/2 flex flex-col h-full relative">
            <BlockList
              blocks={inboxBlocks}
              title="Inbox"
              droppableId="inbox"
              addBlock={addBlockToDraft}
            />
          </div>

          {draft ? (
            <div className="w-1/2 flex flex-col h-full relative">
              <BlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                addBlock={addBlockToDraft}
              />
            </div>
          ) : (
            <p>No Drafts.</p>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
