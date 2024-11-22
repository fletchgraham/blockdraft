"use server";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function addBlock(block) {
  const user = (await auth())?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Validate block
  if (
    !block.draftId ||
    typeof block.draftId !== "string" ||
    !block.type ||
    typeof block.type !== "string" ||
    !block.content ||
    typeof block.content !== "string"
  ) {
    throw new Error(
      "Each block must include draftId, type, and content as strings."
    );
  }

  // Convert draftId to ObjectId
  block.draftId = ObjectId.createFromHexString(block.draftId);

  // add userId to block
  block.userId = ObjectId.createFromHexString(user.userId);

  const blocksCollection = await getCollection("blocks");
  const result = await blocksCollection.insertOne(block);

  // Return the newly added block
  const newBlock = await blocksCollection.findOne({ _id: result.insertedId });
  newBlock._id = newBlock._id.toString();
  if (newBlock.draftId) {
    newBlock.draftId = newBlock.draftId.toString();
  }
  // scrub user id
  delete newBlock.userId;
  return newBlock;
}
