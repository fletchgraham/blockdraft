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

  // Prepare update document with proper MongoDB operators
  let updateDoc = {};

  // Handle draftId - set to null for inbox, or to the draftId for draft
  if (newDraftId === null || newDraftId === "inbox") {
    updateDoc = {
      $set: { position: newPosition },
      $unset: { draftId: "" },
    };
  } else {
    updateDoc = {
      $set: {
        position: newPosition,
        draftId: ObjectId.createFromHexString(newDraftId),
      },
    };
  }

  // Update the block
  const result = await blocksCollection.updateOne(
    { _id: blockObjectId },
    updateDoc
  );

  if (result.modifiedCount === 0) {
    throw new Error("Failed to update block position");
  }

  return { success: true };
}
