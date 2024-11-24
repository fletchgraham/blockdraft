"use server";

import { auth } from "@/auth";
import { cleanMongoDocument, getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function updateBlock(updatedBlock) {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Validate updatedBlock
  if (
    !updatedBlock._id ||
    typeof updatedBlock._id !== "string" ||
    !updatedBlock.title ||
    typeof updatedBlock.title !== "string" ||
    !updatedBlock.url ||
    typeof updatedBlock.url !== "string" ||
    (updatedBlock.thumbnailUrl &&
      typeof updatedBlock.thumbnailUrl !== "string") ||
    (updatedBlock.summary && typeof updatedBlock.summary !== "string")
  ) {
    throw new Error(
      "Each block must include _id, title, and url as strings. ThumbnailUrl and summary must also be strings if provided."
    );
  }

  // Convert _id and ensure ownership
  const blockId = ObjectId.createFromHexString(updatedBlock._id);
  const userId = ObjectId.createFromHexString(user.userId);

  const blocksCollection = await getCollection("blocks");

  // Check if the block exists and belongs to the user
  const existingBlock = await blocksCollection.findOne({
    _id: blockId,
    userId: userId,
  });
  if (!existingBlock) {
    throw new Error("Block not found or not owned by the authenticated user.");
  }

  // Prepare the updated fields
  const updateFields = {
    title: updatedBlock.title,
    url: updatedBlock.url,
    thumbnailUrl: updatedBlock.thumbnailUrl || null,
    summary: updatedBlock.summary || null,
  };

  // Perform the update
  const result = await blocksCollection.updateOne(
    { _id: blockId },
    { $set: updateFields }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Failed to update the block.");
  }

  // Fetch and return the updated block
  const updatedBlockResult = await blocksCollection.findOne({ _id: blockId });
  updatedBlockResult._id = updatedBlockResult._id.toString();
  if (updatedBlockResult.draftId) {
    updatedBlockResult.draftId = updatedBlockResult.draftId.toString();
  }

  return cleanMongoDocument(updatedBlockResult);
}
