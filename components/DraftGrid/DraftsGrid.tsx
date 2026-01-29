"use client";
import { useState, useEffect } from "react";

import DraftCard from "./DraftCard";
import { getDraftsWithBlocks } from "@/lib/db";
import {
  duplicateDraft,
  deleteDraft,
  archiveDraft,
  unarchiveDraft,
} from "@/actions/drafts";

export default function DraftsGrid() {
  const [drafts, setDrafts] = useState([]);
  const [archivedDrafts, setArchivedDrafts] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch drafts with blocks to get thumbnail URLs
  useEffect(() => {
    const fetchData = async () => {
      const allDrafts = await getDraftsWithBlocks();
      // Separate active and archived drafts
      const activeDrafts = allDrafts.filter((draft) => !draft.archived);
      const archived = allDrafts.filter((draft) => draft.archived);
      setDrafts(activeDrafts);
      setArchivedDrafts(archived);
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

      // remove draft from both active and archived drafts
      setDrafts((drafts) => drafts.filter((draft) => draft._id !== draftId));
      setArchivedDrafts((archived) =>
        archived.filter((draft) => draft._id !== draftId)
      );
    } catch (error) {
      console.error("Failed to delete draft:", error);
      alert("An error occurred while deleting the draft.");
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

    if (result.success) {
      // Find the draft being archived
      const draftToArchive = drafts.find((draft) => draft._id === draftId);

      if (draftToArchive) {
        // Remove from active drafts
        setDrafts((drafts) => drafts.filter((draft) => draft._id !== draftId));

        // Add to archived drafts with archived flag
        setArchivedDrafts((archived) => [
          { ...draftToArchive, archived: true },
          ...archived,
        ]);
      }
    }
  };

  const handleUnarchive = async (draftId) => {
    console.log("Unarchiving draft:", draftId);
    const result = await unarchiveDraft(draftId);

    if (result.success) {
      // Find the draft being unarchived
      const draftToUnarchive = archivedDrafts.find(
        (draft) => draft._id === draftId
      );

      if (draftToUnarchive) {
        // Remove from archived drafts
        setArchivedDrafts((archived) =>
          archived.filter((draft) => draft._id !== draftId)
        );

        // Add to active drafts without archived flag
        const { archived, ...unarchivedDraft } = draftToUnarchive;
        setDrafts((drafts) => [unarchivedDraft, ...drafts]);
      }
    }
  };

  const toggleArchived = () => {
    setShowArchived(!showArchived);
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
            onUnarchive={handleUnarchive}
          />
        ))}
      </div>

      {/* Show/Hide Archived Button */}
      {archivedDrafts.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={toggleArchived} className="btn btn-outline">
            {showArchived ? "Hide Archived" : "Show Archived"} (
            {archivedDrafts.length})
          </button>
        </div>
      )}

      {/* Archived Drafts Section */}
      {showArchived && archivedDrafts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-600">
            Archived Drafts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {archivedDrafts.map((draft) => (
              <DraftCard
                key={draft._id}
                draft={draft}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
