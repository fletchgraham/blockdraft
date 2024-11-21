"use server";
import { redirect } from "next/navigation";

import { ObjectId } from "mongodb";
import { auth } from "@/auth"; // Import the Auth.js function
import { getCollection, cleanMongoDocument } from "@/lib/db";

// Get inbox blocks for the authenticated user
export const getInboxBlocks = async () => {
  const session = await auth(); // Get the session data
  if (!session || !session.user?.id) {
    return redirect("/"); // Redirect if the user is not authenticated
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      userId: ObjectId.createFromHexString(session.user.id), // Match the user's blocks
      draftId: { $exists: false }, // Ensure it's not part of any draft
    })
    .toArray();

  // Clean the blocks before returning
  return blocks.map(cleanMongoDocument);
};

// Get blocks for a specific draft
export const getBlocksForDraft = async (draftId) => {
  const session = await auth(); // Get the session data
  if (!session || !session.user?.id) {
    return redirect("/"); // Redirect if the user is not authenticated
  }

  // Validate the draftId
  if (!ObjectId.isValid(draftId)) {
    throw new Error("Invalid draft ID");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      draftId: ObjectId.createFromHexString(draftId), // Match the draftId
      userId: ObjectId.createFromHexString(session.user.id), // Ensure the block belongs to the authenticated user
    })
    .sort({ order: 1, _id: 1 }) // Sort by `order` and `_id` as fallback
    .toArray();

  // Clean the blocks before returning
  return blocks.map(cleanMongoDocument);
};
