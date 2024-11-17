"use server";

import { ObjectId } from "mongodb";

import { getCollection, getBlocksForDraft, cleanMongoDocument } from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUser";

export async function getDraft(draftId) {
  const user = await getUserFromCookies();
  if (!user) {
    return null;
  }

  const draftCollection = await getCollection("drafts");
  const draftDoc = await draftCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
  });

  if (!draftDoc._id.toString() === user.userId) {
    return null;
  }

  return cleanMongoDocument(draftDoc);
}

export async function getDrafts(userId) {
  const draftCollection = await getCollection("drafts");
  const draftDocs = await draftCollection.find({ userId }).toArray();
  return draftDocs.map(cleanMongoDocument);
}

export async function getDraftsWithBlocks() {
  const user = await getUserFromCookies();
  if (!user) {
    return [];
  }
  // fetch and clean drafts
  let drafts = await getDrafts(user.userId);
  drafts = drafts.map((draft) => cleanMongoDocument(draft));

  // Use Promise.all to fetch blocks for each draft concurrently
  await Promise.all(
    drafts.map(async (draft) => {
      draft.blocks = await getBlocksForDraft(draft._id.toString());
    })
  );

  return drafts; // Return drafts with their blocks attached
}
