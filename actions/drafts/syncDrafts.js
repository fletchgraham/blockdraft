"use server";

import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function syncDrafts(updatedDrafts) {
  const blocksCollection = await getCollection("blocks");
  console.log("UPDATING DRAFTS");

  const blocksInDrafts = [];

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
        blocksInDrafts.push(mongoBlockId);
      }
    }

    // safeguard against moving all blocks to inbox
    if (blocksInDrafts.length > 0) {
      // Unset draftId and order for blocks not in any drafts
      await blocksCollection.updateMany(
        { _id: { $nin: blocksInDrafts } },
        { $unset: { draftId: "", order: "" } }
      );
    } else {
      console.warn(
        "No blocks in drafts. Skipping updateMany operation to unset draftId."
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating drafts:", error);
    return { success: false, error: error.message };
  }
}
