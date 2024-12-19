"use client";

// framework
import { useState, useEffect } from "react";
import Link from "next/link";

// third party
import { DragDropContext } from "@hello-pangea/dnd";

// actions
import { addBlock } from "@/actions/blocks";
import { deleteBlock } from "@/actions/blocks";
import { updateBlock } from "@/actions/blocks";

// utils
import { handleDragEnd, syncData } from "./utils";
import { getInboxBlocks, getDraftsWithBlocks } from "@/lib/db";
import { useWarnOnUnsavedChanges } from "@/hooks";

// components
import Header from "../Header";
import BlockList from "./BlockList";
import OpenDraftMenu from "./OpenDraftMenu";
import AddBlockModal from "./AddBlockModal";
import EditBlockModal from "./EditBlockModal";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState();
  const [drafts, setDrafts] = useState([]);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [isChanged, setIsChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox"); // State for active tab
  const [blockToEdit, setBlockToEdit] = useState(null);

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

  // util to close all detail tags
  const closeAllDropdowns = () => {
    const details = document.querySelectorAll("details");
    details.forEach((detail) => {
      detail.removeAttribute("open");
    });
  };

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

  const handleEditBlock = (block) => {
    setBlockToEdit(block);
    document.getElementById("edit-block-modal-id").showModal();
  };

  const closeEditBlockModal = () => {
    setBlockToEdit(null);
    closeAllDropdowns();
    document.getElementById("edit-block-modal-id").close();
  };

  const onUpdateBlock = async (updatedBlock) => {
    closeAllDropdowns();
    try {
      // Update the block in the backend
      const resultBlock = await updateBlock(updatedBlock);
      if (resultBlock) {
        // Update the state
        if (resultBlock.draftId) {
          setDraft((prevDraft) => ({
            ...prevDraft,
            blocks: prevDraft.blocks.map((block) =>
              block._id === resultBlock._id ? resultBlock : block
            ),
          }));
        } else {
          setInboxBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
              block._id === resultBlock._id ? resultBlock : block
            )
          );
        }
      } else {
        alert("An error occurred while updating the block.");
      }
    } catch (error) {
      console.error("Failed to update block:", error);
      alert("An error occurred while updating the block.");
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

  const blockListButtonClasses =
    "btn btn-ghost rounded-box shadow w-full mb-2 bg-base-100";

  return (
    <div className="flex flex-col">
      <Header title="Draft Editor">
        <span className="btn btn-ghost">{syncStatus}</span>
        <OpenDraftMenu drafts={drafts} onOpenDraft={handleOpenDraft} />
      </Header>

      {/* Tab Navigation for Small Screens */}
      <div className="flex sm:hidden justify-center border-b tabs tabs-boxed">
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
            <div className="flex flex-col h-full p-4">
              <Link href="/import-urls" className={blockListButtonClasses}>
                + Import
              </Link>
              <BlockList
                blocks={inboxBlocks.sort(
                  (a, b) => b.contentDate - a.contentDate
                )}
                title="Inbox"
                droppableId="inbox"
                onDeleteBlock={handleDeleteBlock}
                onEditBlock={handleEditBlock}
                onBlockMove={handleBlockMove}
              />
            </div>
          </DragDropContext>
        )}
        {activeTab === "draft" && draft && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full p-4">
              <button
                className={blockListButtonClasses}
                onClick={() =>
                  document.getElementById("add-block-modal-id").showModal()
                }
              >
                + New Custom Block
              </button>
              <BlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                onDeleteBlock={handleDeleteBlock}
                onEditBlock={handleEditBlock}
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
            <Link href="/import-urls" className={blockListButtonClasses}>
              + Import
            </Link>
            {/* sort blocks by contentDate newest first */}
            <BlockList
              blocks={inboxBlocks.sort((a, b) => b.contentDate - a.contentDate)}
              title="Inbox"
              droppableId="inbox"
              onDeleteBlock={handleDeleteBlock}
              onEditBlock={handleEditBlock}
              onBlockMove={handleBlockMove}
            />
          </div>

          {draft ? (
            <div className="w-1/2 flex flex-col h-full relative">
              <h2 className="text-center font-bold mb-2">{draft.name}</h2>
              <button
                className={blockListButtonClasses}
                onClick={() =>
                  document.getElementById("add-block-modal-id").showModal()
                }
              >
                + New Custom Block
              </button>
              <BlockList
                blocks={draft.blocks}
                title={draft.name}
                droppableId="draft"
                onDeleteBlock={handleDeleteBlock}
                onEditBlock={handleEditBlock}
                onBlockMove={handleBlockMove}
              />
            </div>
          ) : (
            <p>No Drafts.</p>
          )}
        </DragDropContext>
      </div>

      <AddBlockModal onAddBlock={addBlockToDraft} />
      <EditBlockModal
        block={blockToEdit}
        onEditBlock={onUpdateBlock}
        onClose={closeEditBlockModal}
      />
    </div>
  );
}
