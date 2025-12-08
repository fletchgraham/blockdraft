"use client";

import { syncDrafts } from "@/actions/drafts/syncDrafts";

export const syncData = async (
  drafts,
  inboxBlocks,
  isChanged,
  setSyncStatus,
  setIsChanged
) => {
  if (!isChanged) return;

  setSyncStatus("Syncing...");
  try {
    const result = await syncDrafts(drafts, inboxBlocks); // Call the server action directly

    if (result.success) {
      setSyncStatus("Synced");
      setIsChanged(false); // Reset isChanged here to avoid re-syncing
    } else {
      console.error("Sync failed:", result.error);
      setSyncStatus("Failed to sync");
    }
  } catch (error) {
    console.error("Sync error:", error);
    setSyncStatus("Failed to sync");
  }
};
