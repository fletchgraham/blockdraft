"use client";
import { useState, useEffect } from "react";

import DraftCard from "./DraftCard";
import { getDraftsWithBlocks } from "@/lib/db";
import { duplicateDraft, deleteDraft, archiveDraft } from "@/actions/drafts";

export default function DraftsGrid() {
  const [drafts, setDrafts] = useState([]);

  // Fetch drafts with blocks to get thumbnail URLs
  useEffect(() => {
    const fetchData = async () => {
      const drafts = await getDraftsWithBlocks();
      setDrafts(drafts);
    };
    fetchData();
  }, []);

  const handleDuplicate = async (draftId, newName) => {
    try {
      console.log("Duplicating draft:", draftId, newName);
      const result = await duplicateDraft(draftId, newName);
      if (result.success) {
        setDrafts((drafts) => [result.newDraft, ...drafts]);
      } else {
        alert("An error occurred while duplicating the draft.");
      }
    } catch (error) {
      console.error("Error duplicating draft:", error);
      alert("An error occurred while duplicating the draft.");
    }
  };

  const handleDelete = async (draftId, moveBlocksToInbox) => {
    try {
      // Call the server action directly
      const result = await deleteDraft(draftId, moveBlocksToInbox);

      // remove draft from drafts
      setDrafts((drafts) => drafts.filter((draft) => draft._id !== draftId));
    } catch (error) {
      console.error("Failed to add block:", error);
      alert("An error occurred while adding the block.");
    }

    try {
      console.log("Deleting draft:", draftId);
    } catch (error) {
      console.error("Error deleting draft:", error);
      alert("An error occurred while deleting the draft.");
    }
  };

  const handleArchive = async (draftId) => {
    console.log("Archiving draft:", draftId);
    const result = await archiveDraft(draftId);
  };

  return (
    <div className="p-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {drafts.map((draft) => (
          <DraftCard
            key={draft._id}
            draft={draft}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
          />
        ))}
      </div>
    </div>
  );
}
