"use server";

import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { getCollection } from "@/lib/db";

export async function updateBlockPosition(blockId, newDraftId, newPosition) {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const blocksCollection = await getCollection("blocks");
  const userId = ObjectId.createFromHexString(user.userId);
  const blockObjectId = ObjectId.createFromHexString(blockId);

  // Check if the block exists and belongs to the user
  const existingBlock = await blocksCollection.findOne({
    _id: blockObjectId,
    userId: userId,
  });

  if (!existingBlock) {
    throw new Error("Block not found or not owned by the authenticated user.");
  }

  // If moving to inbox (from draft), just remove draftId and order
  if (newDraftId === null || newDraftId === "inbox") {
    const updateDoc = {
      $unset: { draftId: "", order: "" }, // Remove both draftId and order for inbox items
    };

    const result = await blocksCollection.updateOne(
      { _id: blockObjectId },
      updateDoc
    );

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update block position");
    }
  } else if (newDraftId && newDraftId !== "inbox") {
    // Moving to a draft OR reordering within a draft - handle both cases the same way
    const draftObjectId = ObjectId.createFromHexString(newDraftId);

    // Get all blocks in the target draft sorted by current order, excluding the moving block
    const draftBlocks = await blocksCollection
      .find({
        draftId: draftObjectId,
        userId: userId,
        _id: { $ne: blockObjectId }, // Exclude the moving block
      })
      .sort({ order: 1, _id: 1 })
      .toArray();

    // Insert the moving block at the new position
    draftBlocks.splice(newPosition, 0, { _id: blockObjectId });

    // Update all blocks with new order and draftId
    const bulkOps = draftBlocks.map((block, index) => ({
      updateOne: {
        filter: { _id: block._id },
        update: {
          $set: {
            order: index,
            draftId: draftObjectId,
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await blocksCollection.bulkWrite(bulkOps);
    }
  }

  return { success: true };
}
