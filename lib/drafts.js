"use server";

import { getCollection } from "/lib/db";
import { ObjectId } from "mongodb";
import { getBlocksForDraft } from "@/lib/blocks";
import { getUserFromCookies } from "@/lib/getUser";

export async function getDraft(draftId) {
  const draftCollection = await getCollection("drafts");
  const draftDoc = await draftCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
  });
  const draft = {
    _id: draftDoc._id.toString(),
    name: draftDoc.name,
    userId: draftDoc.userId,
  };
  return draft;
}

export async function getDrafts(userId) {
  const draftCollection = await getCollection("drafts");
  const draftDocs = await draftCollection.find({ userId }).toArray();
  const drafts = draftDocs.map((draftDoc) => {
    return {
      _id: draftDoc._id,
      name: draftDoc.name,
    };
  });
  return drafts;
}

export async function getDraftsWithBlocks() {
  const user = await getUserFromCookies();
  if (!user) {
    return [];
  }
  // Fetch drafts for the given user
  const drafts = await getDrafts(user.userId);

  // turn _id into string
  drafts.forEach((draft) => {
    draft._id = draft._id.toString();
  });

  // Use Promise.all to fetch blocks for each draft concurrently
  await Promise.all(
    drafts.map(async (draft) => {
      draft.blocks = await getBlocksForDraft(draft._id.toString());
    })
  );

  return drafts; // Return drafts with their blocks attached
}
