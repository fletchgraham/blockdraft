"use server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getUserFromCookies } from "./getUser";
import { getCollection } from "./db";

export const getBlocks = async () => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({ userId: ObjectId.createFromHexString(user.userId) })
    .toArray();

  return blocks;
};

export const getInboxBlocks = async () => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }
  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      userId: ObjectId.createFromHexString(user.userId),
      draftId: { $exists: false },
    })
    .toArray();

  // scrub userId from blocks
  blocks.forEach((block) => {
    delete block.userId;
  });

  // turn _id into a string
  blocks.forEach((block) => {
    block._id = block._id.toString();
  });

  // turn draftId into a string if it exists
  blocks.forEach((block) => {
    if (block.draftId) {
      block.draftId = block.draftId.toString();
    }
  });

  return blocks;
};

export const getBlocksForDraft = async (draftId) => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");

  const blocks = await blocksCollection
    .find({
      draftId: ObjectId.createFromHexString(draftId),
    })
    .sort({ order: 1, _id: 1 }) // Sort by `order` (ascending) and `_id` as a fallback
    .toArray();

  // scrub blocks of user id
  blocks.forEach((block) => {
    delete block.userId;
  });

  // convert blocks to simple objects
  blocks.forEach((block) => {
    block._id = block._id.toString();
    if (block.draftId) {
      block.draftId = block.draftId.toString();
    }
  });

  return blocks;
};
