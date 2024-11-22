"use server";

import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import { getCollection, getBlocksForDraft, cleanMongoDocument } from "@/lib/db";

export async function getDraft(draftId) {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const draftCollection = await getCollection("drafts");
  const draftDoc = await draftCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
    userId: ObjectId.createFromHexString(user.userId), // Ensure the draft belongs to the logged-in user
  });

  if (!draftDoc) {
    throw new Error("Draft not found or not authorized to view");
  }

  return cleanMongoDocument(draftDoc);
}

export async function getDrafts() {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const draftCollection = await getCollection("drafts");

  // Fetch and sort drafts
  const draftDocs = await draftCollection
    .find({ userId: ObjectId.createFromHexString(user.userId) }) // Match drafts to the logged-in user
    .sort({ createdAt: -1 })
    .toArray();

  return draftDocs.map(cleanMongoDocument);
}

// Fetch all drafts with their blocks for the authenticated user
export async function getDraftsWithBlocks() {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch drafts for the user
  const drafts = await getDrafts();

  // Fetch blocks for each draft
  await Promise.all(
    drafts.map(async (draft) => {
      draft.blocks = await getBlocksForDraft(draft._id.toString());
    })
  );

  return drafts; // Return drafts with blocks attached
}
