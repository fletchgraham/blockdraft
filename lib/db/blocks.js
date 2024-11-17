"use server";
import { redirect } from "next/navigation";

import { ObjectId } from "mongodb";

import { getUserFromCookies } from "@/lib/getUser";
import { getCollection, cleanMongoDocument } from "@/lib/db";

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

  // clean blocks
  return blocks.map(cleanMongoDocument);
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

  // clean blocks
  return blocks.map(cleanMongoDocument);
};
