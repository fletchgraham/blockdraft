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

  // If moving between different containers (inbox to draft or vice versa)
  // we just need to update the draftId and set a basic order
  if (
    (existingBlock.draftId &&
      (newDraftId === null || newDraftId === "inbox")) ||
    (!existingBlock.draftId && newDraftId && newDraftId !== "inbox")
  ) {
    // Moving between containers - simple update
    let updateDoc = {};

    if (newDraftId === null || newDraftId === "inbox") {
      updateDoc = {
        $unset: { draftId: "", order: "" }, // Remove both draftId and order for inbox items
      };
    } else {
      // Get current count of blocks in target draft to set order
      const draftBlockCount = await blocksCollection.countDocuments({
        draftId: ObjectId.createFromHexString(newDraftId),
        userId: userId,
      });

      updateDoc = {
        $set: {
          draftId: ObjectId.createFromHexString(newDraftId),
          order: newPosition !== undefined ? newPosition : draftBlockCount,
        },
      };
    }

    const result = await blocksCollection.updateOne(
      { _id: blockObjectId },
      updateDoc
    );

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update block position");
    }
  } else if (newDraftId && newDraftId !== "inbox") {
    // Reordering within the same draft - need to update order of multiple blocks
    const draftObjectId = ObjectId.createFromHexString(newDraftId);

    // Get all blocks in the draft sorted by current order
    const draftBlocks = await blocksCollection
      .find({
        draftId: draftObjectId,
        userId: userId,
      })
      .sort({ order: 1, _id: 1 })
      .toArray();

    // Remove the moving block from the array
    const movingBlockIndex = draftBlocks.findIndex((block) =>
      block._id.equals(blockObjectId)
    );
    if (movingBlockIndex === -1) {
      throw new Error("Block not found in draft");
    }

    const movingBlock = draftBlocks.splice(movingBlockIndex, 1)[0];

    // Insert at new position
    draftBlocks.splice(newPosition, 0, movingBlock);

    // Update order for all blocks
    const bulkOps = draftBlocks.map((block, index) => ({
      updateOne: {
        filter: { _id: block._id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await blocksCollection.bulkWrite(bulkOps);
    }
  }

  return { success: true };
}
