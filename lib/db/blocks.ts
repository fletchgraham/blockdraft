"use server";
import { redirect } from "next/navigation";

import { ObjectId } from "mongodb";
import { auth } from "@/auth"; // Import the Auth.js function
import { getCollection, cleanMongoDocument } from "@/lib/db";

// Get inbox blocks for the authenticated user
export const getInboxBlocks = async (limit: number = 100) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      userId: ObjectId.createFromHexString(user.userId),
      draftId: { $exists: false },
    })
    .sort({ contentDate: -1 }) // Sort by most recent contentDate
    .limit(limit)
    .toArray();

  return blocks.map(cleanMongoDocument);
};

// Get blocks for a specific draft
export const getBlocksForDraft = async (draftId: string) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  // Validate the draftId
  if (!ObjectId.isValid(draftId)) {
    throw new Error("Invalid draft ID");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      draftId: ObjectId.createFromHexString(draftId), // Match the draftId
      userId: ObjectId.createFromHexString(user.userId), // Ensure the block belongs to the authenticated user
    })
    .sort({ order: 1, _id: 1 }) // Sort by `order` and `_id` as fallback
    .toArray();

  // Clean the blocks before returning
  return blocks.map(cleanMongoDocument);
};
