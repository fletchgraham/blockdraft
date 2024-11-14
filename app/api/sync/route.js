import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request) {
  const updatedDrafts = await request.json();
  const blocksCollection = await getCollection("blocks");
  console.log("UPDATING DRAFTS");

  const blocksInDrafts = [];

  // use the updated drafts to move blocks around
  // and update the database
  for (const draft of updatedDrafts) {
    for (const block of draft.blocks) {
      const mongoBlockId = ObjectId.createFromHexString(block._id);
      await blocksCollection.updateOne(
        { _id: mongoBlockId },
        { $set: { draftId: ObjectId.createFromHexString(draft._id) } }
      );
      blocksInDrafts.push(mongoBlockId);
    }
  }

  // remove blocks that are not in any drafts
  await blocksCollection.updateMany(
    { _id: { $nin: blocksInDrafts } },
    { $unset: { draftId: "" } }
  );

  return NextResponse.json({ success: true });
}
