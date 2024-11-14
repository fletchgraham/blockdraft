export const handleDragEnd = (
  result, // the result from the dnd
  setIsChanged, // state setter for the flag indicating changes
  inboxBlocks,
  setInboxBlocks,
  draft,
  setDraft
) => {
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
    if (source.droppableId === "inbox" && destination.droppableId === "draft") {
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
