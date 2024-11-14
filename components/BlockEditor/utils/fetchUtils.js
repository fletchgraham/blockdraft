export async function fetchInboxBlocks(setInboxBlocks) {
  try {
    const response = await fetch("/api/blocks");
    const data = await response.json();
    setInboxBlocks(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
