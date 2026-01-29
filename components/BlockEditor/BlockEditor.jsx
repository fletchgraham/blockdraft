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
import { updateBlockPosition } from "@/actions/blocks";

// utils
import { handleDragEndOptimistic } from "./utils";
import { getInboxBlocks, getDraftsWithBlocks } from "@/lib/db";
import { useWarnOnUnsavedChanges } from "@/hooks";

// components
import Header from "../Header";
import BlockList from "./BlockList";
import OpenDraftMenu from "./OpenDraftMenu";
import AddBlockModal from "./AddBlockModal";
import EditBlockModal from "./EditBlockModal";
import ExportModal, { openExportModal } from "./ExportModal";

export default function BlockEditor() {
  const [inboxBlocks, setInboxBlocks] = useState([]);
  const [draft, setDraft] = useState();
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox"); // State for active tab
  const [blockToEdit, setBlockToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [inboxBlocks, drafts] = await Promise.all([
        getInboxBlocks(100),
        getDraftsWithBlocks(),
      ]);
      setInboxBlocks(inboxBlocks);
      setDrafts(drafts);
      if (drafts.length > 0) setDraft(drafts[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updatedDrafts = drafts.map((d) => (d._id === draft._id ? draft : d));
    setDrafts(updatedDrafts);
  }, [draft]);

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

      // Optimistically update UI
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: prevDraft.blocks.filter((b) => b._id !== block._id),
      }));
      setInboxBlocks((prevBlocks) => [updatedBlock, ...prevBlocks]);

      // Update server
      try {
        await updateBlockPosition(block._id, null, 0);
      } catch (error) {
        console.error("Failed to move block to inbox:", error);
        // Revert optimistic update
        setInboxBlocks((prevBlocks) =>
          prevBlocks.filter((b) => b._id !== block._id)
        );
        setDraft((prevDraft) => ({
          ...prevDraft,
          blocks: [block, ...prevDraft.blocks],
        }));
        alert("Failed to move block to inbox. Please try again.");
      }
    } else {
      const updatedBlock = { ...block, draftId: draft._id };

      // Optimistically update UI
      setInboxBlocks((prevBlocks) =>
        prevBlocks.filter((b) => b._id !== block._id)
      );
      setDraft((prevDraft) => ({
        ...prevDraft,
        blocks: [updatedBlock, ...prevDraft.blocks],
      }));

      // Update server
      try {
        await updateBlockPosition(block._id, draft._id, 0);
      } catch (error) {
        console.error("Failed to move block to draft:", error);
        // Revert optimistic update
        setDraft((prevDraft) => ({
          ...prevDraft,
          blocks: prevDraft.blocks.filter((b) => b._id !== block._id),
        }));
        setInboxBlocks((prevBlocks) => [block, ...prevBlocks]);
        alert("Failed to move block to draft. Please try again.");
      }
    }
  };

  const handleEditBlock = (block) => {
    setBlockToEdit(block);
    document.getElementById("edit-block-modal-id").showModal();
  };

  const handleBlockMoveToTop = async (block) => {
    const originalDraft = draft;

    // Optimistically update UI
    setDraft((prevDraft) => {
      const filtered = prevDraft.blocks.filter((b) => b._id !== block._id);
      return {
        ...prevDraft,
        blocks: [block, ...filtered],
      };
    });

    // Update server
    try {
      await updateBlockPosition(block._id, draft._id, 0);
    } catch (error) {
      console.error("Failed to move block to top:", error);
      // Revert optimistic update
      setDraft(originalDraft);
      alert("Failed to move block to top. Please try again.");
    }

    closeAllDropdowns();
  };

  const handleBlockMoveToBottom = async (block) => {
    const originalDraft = draft;

    // Optimistically update UI
    setDraft((prevDraft) => {
      const filtered = prevDraft.blocks.filter((b) => b._id !== block._id);
      return {
        ...prevDraft,
        blocks: [...filtered, block],
      };
    });

    // Update server
    try {
      await updateBlockPosition(block._id, draft._id, draft.blocks.length - 1);
    } catch (error) {
      console.error("Failed to move block to bottom:", error);
      // Revert optimistic update
      setDraft(originalDraft);
      alert("Failed to move block to bottom. Please try again.");
    }

    closeAllDropdowns();
  };

  const handleBlockMoveToPreviousSection = async (block) => {
    const originalDraft = draft;
    let newPosition = -1;

    // Optimistically update UI
    setDraft((prevDraft) => {
      const blocks = [...prevDraft.blocks];
      const currentIndex = blocks.findIndex((b) => b._id === block._id);

      // Find the previous section header
      let insertIndex = -1;
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (blocks[i].type === "custom") {
          insertIndex = i + 1; // immediately after the previous section header
          break;
        }
      }

      if (insertIndex === -1) return prevDraft;

      newPosition = insertIndex;
      const newBlocks = blocks.filter((b) => b._id !== block._id);
      newBlocks.splice(insertIndex, 0, block);
      return { ...prevDraft, blocks: newBlocks };
    });

    // Update server
    if (newPosition !== -1) {
      try {
        await updateBlockPosition(block._id, draft._id, newPosition);
      } catch (error) {
        console.error("Failed to move block to previous section:", error);
        // Revert optimistic update
        setDraft(originalDraft);
        alert("Failed to move block to previous section. Please try again.");
      }
    }

    closeAllDropdowns();
  };

  const handleBlockMoveToNextSection = async (block) => {
    const originalDraft = draft;
    let newPosition = -1;

    // Optimistically update UI
    setDraft((prevDraft) => {
      const blocks = [...prevDraft.blocks];
      const currentIndex = blocks.findIndex((b) => b._id === block._id);

      // Find the next section header
      let insertIndex = -1;
      for (let i = currentIndex + 1; i < blocks.length; i++) {
        if (blocks[i].type === "custom") {
          insertIndex = i + 1; // immediately after the next section header
          break;
        }
      }

      if (insertIndex === -1) return prevDraft;

      newPosition = insertIndex;
      const newBlocks = blocks.filter((b) => b._id !== block._id);
      newBlocks.splice(insertIndex, 0, block);
      return { ...prevDraft, blocks: newBlocks };
    });

    // Update server
    if (newPosition !== -1) {
      try {
        await updateBlockPosition(block._id, draft._id, newPosition);
      } catch (error) {
        console.error("Failed to move block to next section:", error);
        // Revert optimistic update
        setDraft(originalDraft);
        alert("Failed to move block to next section. Please try again.");
      }
    }

    closeAllDropdowns();
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
    handleDragEndOptimistic(
      result,
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
      <Header title="Editor">
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
              <div className="flex gap-2 mb-2">
                <Link
                  href="/import-urls"
                  className="flex-1 btn bg-base-100 rounded-box"
                >
                  + Import
                </Link>
                <button
                  className="btn bg-base-100 rounded-box"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Refresh
                </button>
                <button
                  className="btn bg-base-100 rounded-box"
                  onClick={openExportModal}
                >
                  Export
                </button>
              </div>
              <BlockList
                blocks={inboxBlocks.sort(
                  (a, b) => b.contentDate - a.contentDate
                )}
                title="Inbox"
                droppableId="inbox"
                onDeleteBlock={handleDeleteBlock}
                onEditBlock={handleEditBlock}
                onBlockMove={handleBlockMove}
                onBlockMoveToTop={handleBlockMoveToTop}
                onBlockMoveToBottom={handleBlockMoveToBottom}
                onBlockMoveToPreviousSection={handleBlockMoveToPreviousSection}
                onBlockMoveToNextSection={handleBlockMoveToNextSection}
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
                onBlockMoveToTop={handleBlockMoveToTop}
                onBlockMoveToBottom={handleBlockMoveToBottom}
                onBlockMoveToPreviousSection={handleBlockMoveToPreviousSection}
                onBlockMoveToNextSection={handleBlockMoveToNextSection}
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
            <div className="flex gap-2 mb-2">
              <Link
                href="/import-urls"
                className="flex-1 btn bg-base-100 rounded-box"
              >
                + Import
              </Link>
              <button
                className="btn bg-base-100 rounded-box"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh
              </button>
              <button
                className="btn bg-base-100 rounded-box"
                onClick={openExportModal}
              >
                Export
              </button>
            </div>
            {/* sort blocks by contentDate newest first */}
            <BlockList
              blocks={inboxBlocks.sort((a, b) => b.contentDate - a.contentDate)}
              title="Inbox"
              droppableId="inbox"
              onDeleteBlock={handleDeleteBlock}
              onEditBlock={handleEditBlock}
              onBlockMove={handleBlockMove}
              onBlockMoveToTop={handleBlockMoveToTop}
              onBlockMoveToBottom={handleBlockMoveToBottom}
              onBlockMoveToPreviousSection={handleBlockMoveToPreviousSection}
              onBlockMoveToNextSection={handleBlockMoveToNextSection}
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
                onBlockMoveToTop={handleBlockMoveToTop}
                onBlockMoveToBottom={handleBlockMoveToBottom}
                onBlockMoveToPreviousSection={handleBlockMoveToPreviousSection}
                onBlockMoveToNextSection={handleBlockMoveToNextSection}
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
      <ExportModal blocks={inboxBlocks} />
    </div>
  );
}
