import { updateBlockPosition } from "@/actions/blocks";

export const handleDragEndOptimistic = async (
  result, // the result from the dnd
  inboxBlocks,
  setInboxBlocks,
  draft,
  setDraft
) => {
  const { source, destination } = result;

  // If there's no destination (e.g., item was dragged out of the list), do nothing
  if (!destination) return;

  // If the source and destination lists are the same, handle reordering within that list
  if (source.droppableId === destination.droppableId) {
    // Check if the move is within the "inbox" list
    if (source.droppableId === "inbox") {
      // Create a new copy of the inboxBlocks array
      const reorderedInboxBlocks = Array.from(inboxBlocks);

      // Remove the item from its original position and insert it at the new index
      const [movedBlock] = reorderedInboxBlocks.splice(source.index, 1);
      reorderedInboxBlocks.splice(destination.index, 0, movedBlock);

      // Optimistically update the UI
      setInboxBlocks(reorderedInboxBlocks);

      // Update server
      try {
        await updateBlockPosition(movedBlock._id, null, destination.index);
      } catch (error) {
        console.error("Failed to update block position:", error);
        // Revert the optimistic update on error
        setInboxBlocks(inboxBlocks);
        alert("Failed to update block position. Please try again.");
      }
    }
    // Check if the move is within the "draft" list
    else if (source.droppableId === "draft") {
      // Create a new copy of the draft.blocks array
      const reorderedDraftBlocks = Array.from(draft.blocks);

      // Remove the item from its original position and insert it at the new index
      const [movedBlock] = reorderedDraftBlocks.splice(source.index, 1);
      reorderedDraftBlocks.splice(destination.index, 0, movedBlock);

      // Optimistically update the UI
      setDraft({ ...draft, blocks: reorderedDraftBlocks });

      // Update server
      try {
        await updateBlockPosition(movedBlock._id, draft._id, destination.index);
      } catch (error) {
        console.error("Failed to update block position:", error);
        // Revert the optimistic update on error
        setDraft(draft);
        alert("Failed to update block position. Please try again.");
      }
    }
  }
  // If moving items between different lists, handle accordingly
  else {
    // Moving from "inbox" to "draft"
    if (source.droppableId === "inbox" && destination.droppableId === "draft") {
      // Create a copy of both the inbox and draft blocks arrays
      const newInboxBlocks = Array.from(inboxBlocks);
      const newDraftBlocks = Array.from(draft.blocks);

      // Remove the item from inbox and add it to draft at the specified index
      const [movedBlock] = newInboxBlocks.splice(source.index, 1);

      // Update the block to include the draftId
      const updatedBlock = { ...movedBlock, draftId: draft._id };

      newDraftBlocks.splice(destination.index, 0, updatedBlock);

      // Optimistically update the UI
      setInboxBlocks(newInboxBlocks);
      setDraft({ ...draft, blocks: newDraftBlocks });

      // Update server
      try {
        await updateBlockPosition(movedBlock._id, draft._id, destination.index);
      } catch (error) {
        console.error("Failed to move block to draft:", error);
        // Revert the optimistic update on error
        setInboxBlocks(inboxBlocks);
        setDraft(draft);
        alert("Failed to move block to draft. Please try again.");
      }
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

      // Update the block to remove the draftId
      const updatedBlock = { ...movedBlock, draftId: null };

      newInboxBlocks.splice(destination.index, 0, updatedBlock);

      // Optimistically update the UI
      setDraft({ ...draft, blocks: newDraftBlocks });
      setInboxBlocks(newInboxBlocks);

      // Update server
      try {
        await updateBlockPosition(movedBlock._id, null, destination.index);
      } catch (error) {
        console.error("Failed to move block to inbox:", error);
        // Revert the optimistic update on error
        setDraft(draft);
        setInboxBlocks(inboxBlocks);
        alert("Failed to move block to inbox. Please try again.");
      }
    }
  }
};
