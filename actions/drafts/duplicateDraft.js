"use server";

import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isShorterThan, isLongerThan } from "@/lib/validators";
import { getCollection, getBlocksForDraft, getDraftWithBlocks } from "@/lib/db";

export async function duplicateDraft(draftId, newDraftName) {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  // Validate the draftId
  if (!draftId || typeof draftId !== "string") {
    throw new Error("Invalid draft ID provided.");
  }

  if (!ObjectId.isValid(draftId)) {
    throw new Error("Invalid draft ID provided.");
  }

  if (!newDraftName || typeof newDraftName !== "string") {
    throw new Error("Invalid draft name provided.");
  }

  if (await isShorterThan(newDraftName, 3)) {
    throw new Error("Draft name must be at least 3 characters");
  }

  if (await isLongerThan(newDraftName, 40)) {
    throw new Error("Draft name must be at most 40 characters");
  }

  // Create the new draft object
  const newDraft = {
    name: newDraftName,
    userId: ObjectId.createFromHexString(user.userId),
    createdAt: new Date(),
  };

  const draftsCollection = await getCollection("drafts");
  const blocksCollection = await getCollection("blocks");

  // instert the new draft and get a reference to the new draft
  const result = await draftsCollection.insertOne(newDraft);
  const newDraftId = result.insertedId;

  // Get the blocks for the original draft
  const blocks = await getBlocksForDraft(draftId);

  // Duplicate the blocks
  const newBlocks = blocks.map((block) => {
    delete block._id;
    block.draftId = newDraftId;
    block.userId = ObjectId.createFromHexString(user.userId);
    return block;
  });

  // Insert the new blocks
  await blocksCollection.insertMany(newBlocks);

  // return the clean new draft with blocks
  const newCleanDraftWithBlocks = await getDraftWithBlocks(
    newDraftId.toString()
  );
  return {
    success: true,
    newDraft: newCleanDraftWithBlocks,
  };
}
