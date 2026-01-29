"use server";

import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function syncDrafts(updatedDrafts, inboxBlocks) {
  const blocksCollection = await getCollection("blocks");
  console.log("UPDATING DRAFTS");

  try {
    // Iterate through each draft and update blocks with draftId and order
    for (const draft of updatedDrafts) {
      for (const [index, block] of draft.blocks.entries()) {
        const mongoBlockId = ObjectId.createFromHexString(block._id);

        // Update the draftId and order for each block in the draft
        await blocksCollection.updateOne(
          { _id: mongoBlockId },
          {
            $set: {
              draftId: ObjectId.createFromHexString(draft._id),
              order: index, // Set the order to the current index in the draft's blocks array
            },
          }
        );
      }
    }

    // Iterate through each block in the inboxBlocks and update the draftId to null and order to null
    for (const block of inboxBlocks) {
      const mongoBlockId = ObjectId.createFromHexString(block._id);

      // Update the draftId and order for each block in the inboxBlocks
      await blocksCollection.updateOne(
        { _id: mongoBlockId },
        {
          $set: {
            draftId: null,
            order: null, // Set the order to null for inbox blocks
          },
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating drafts:", error);
    return { success: false, error: error.message };
  }
}
