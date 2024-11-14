export const syncData = async (
  drafts,
  isChanged,
  setSyncStatus,
  setIsChanged
) => {
  if (!isChanged) return;

  setSyncStatus("Syncing...");
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts),
    });
    if (response.ok) {
      setSyncStatus("Synced");
      setIsChanged(false); // Reset isChanged here to avoid re-syncing
    } else {
      setSyncStatus("Failed to sync");
    }
  } catch (error) {
    console.error("Sync error:", error);
    setSyncStatus("Failed to sync");
  }
};
