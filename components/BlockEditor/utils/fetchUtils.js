export async function fetchInboxBlocks(setInboxBlocks) {
  try {
    const response = await fetch("/api/blocks");
    const data = await response.json();
    setInboxBlocks(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchDrafts(setDrafts, setDraft) {
  try {
    const response = await fetch("/api/drafts");
    const data = await response.json();
    setDrafts(data);
    setDraft(data[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
