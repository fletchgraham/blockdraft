"use server";

import { ObjectId } from "mongodb";
import { getCollection, getBlocksForDraft } from "@/lib/db";

export async function deleteDraft(draftId, moveBlocksToInbox = false) {
  // Validate the draftId
  if (!draftId || typeof draftId !== "string") {
    throw new Error("Invalid draft ID provided.");
  }

  // Get the drafts collection
  const draftsCollection = await getCollection("drafts");
  const blocksCollection = await getCollection("blocks");

  // Ensure the draft exists
  const draft = await draftsCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
  });
  if (!draft) {
    throw new Error("Draft not found.");
  }

  try {
    // If moveBlocksToInbox is true, remove the draftId from associated blocks
    if (moveBlocksToInbox) {
      await blocksCollection.updateMany(
        { draftId: ObjectId.createFromHexString(draftId) },
        { $unset: { draftId: "", order: "" } }
      );
    } else {
      // Otherwise, delete all blocks associated with the draft
      await blocksCollection.deleteMany({
        draftId: ObjectId.createFromHexString(draftId),
      });
    }

    // Delete the draft itself
    await draftsCollection.deleteOne({
      _id: ObjectId.createFromHexString(draftId),
    });

    return { success: true, message: "Draft deleted successfully." };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return { success: false, error: error.message };
  }
}
