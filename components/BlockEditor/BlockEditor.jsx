"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import BlockList from "./BlockList";
import { addBlock } from "@/actions/blocks";
import { deleteBlock } from "@/actions/blocks";
import { handleDragEnd, syncData } from "./utils";
import { getInboxBlocks, getDraftsWithBlocks } from "@/lib/db";
import Header from "../Header";
import OpenDraftMenu from "./OpenDraftMenu";
import { useWarnOnUnsavedChanges } from "@/hooks";
import AddBlockModal from "./AddBlockModal";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState();
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [isChanged, setIsChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox"); // State for active tab

  useWarnOnUnsavedChanges(isChanged);

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
    setActiveTab("draft");
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

  const handleDeleteBlock = async (block) => {
    const result = await deleteBlock(block._id);
    if (result.success) {
      // if the block has a draftId, remove it from the draft
      if (block.draftId) {
        setDraft((prevDraft) => ({
          ...prevDraft,
          blocks: prevDraft.blocks.filter((b) => b._id !== block._id),
        }));
      } else {
        setInboxBlocks((prevBlocks) =>
          prevBlocks.filter((b) => b._id !== block._id)
        );
      }
    } else {
      alert("An error occurred while deleting the block");
    }
  };

  const handleBlockMove = async (block, destination) => {
    if (destination === "inbox") {
      const updatedBlock = { ...block, draftId: null };
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: prevDraft.blocks.filter((b) => b._id !== block._id),
      }));
      setInboxBlocks((prevBlocks) => [updatedBlock, ...prevBlocks]);
    } else {
      const updatedBlock = { ...block, draftId: draft._id };
      setInboxBlocks((prevBlocks) =>
        prevBlocks.filter((b) => b._id !== block._id)
      );
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: [updatedBlock, ...prevDraft.blocks],
      }));
    }
    setIsChanged(true);
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
      <Header title="Draft Editor">
        <span className="btn btn-ghost">{syncStatus}</span>
        <OpenDraftMenu drafts={drafts} onOpenDraft={handleOpenDraft} />
      </Header>

      {/* Tab Navigation for Small Screens */}
      <div className="flex sm:hidden justify-center border-b mb-4 tabs tabs-boxed">
        <button
          role="tab"
          className={`tab flex-1 ${activeTab === "inbox" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
        <button
          role="tab"
          className={`tab flex-1 ${activeTab === "draft" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("draft")}
        >
          {draft === undefined ? "Draft" : `Draft: ${draft.name}`}
        </button>
      </div>

      {/* Tabbed Layout for Small Screens */}
      <div className="sm:hidden">
        {activeTab === "inbox" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full">
              <BlockList
                blocks={inboxBlocks}
                title="Inbox"
                droppableId="inbox"
                onDeleteBlock={handleDeleteBlock}
                onBlockMove={handleBlockMove}
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
                onDeleteBlock={handleDeleteBlock}
                onBlockMove={handleBlockMove}
              />
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Side-by-Side Layout for Larger Screens */}
      <div className="hidden sm:flex space-x-4 flex-1 p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div key="inbox" className="w-1/2 flex flex-col h-full relative">
            <h2 className="text-center font-bold mb-2">Inbox</h2>
            <BlockList
              blocks={inboxBlocks}
              title="Inbox"
              droppableId="inbox"
              onDeleteBlock={handleDeleteBlock}
              onBlockMove={handleBlockMove}
            />
          </div>

          {draft ? (
            <div className="w-1/2 flex flex-col h-full relative">
              <h2 className="text-center font-bold mb-2">{draft.name}</h2>
              <BlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                onDeleteBlock={handleDeleteBlock}
                onBlockMove={handleBlockMove}
              />
            </div>
          ) : (
            <p>No Drafts.</p>
          )}
        </DragDropContext>
      </div>

      <AddBlockModal onAddBlock={addBlockToDraft} />
    </div>
  );
}
