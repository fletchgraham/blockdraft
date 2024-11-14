import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request) {
  const updatedDrafts = await request.json();
  const blocksCollection = await getCollection("blocks");
  console.log("UPDATING DRAFTS");

  const blocksInDrafts = [];

  // Iterate through each draft and update blocks with draftId and order
  for (const draft of updatedDrafts) {
    for (const [index, block] of draft.blocks.entries()) {
      const mongoBlockId = ObjectId.createFromHexString(block._id);

      // Update the draftId and order for each block in the draft
      await blocksCollection.updateOne(
        { _id: mongoBlockId },
        {
          $set: {
            draftId: ObjectId.createFromHexString(draft._id),
            order: index, // Set the order to the current index in the draft's blocks array
          },
        }
      );
      blocksInDrafts.push(mongoBlockId);
    }
  }

  // Unset draftId and order for blocks not in any drafts
  await blocksCollection.updateMany(
    { _id: { $nin: blocksInDrafts } },
    { $unset: { draftId: "", order: "" } }
  );

  return NextResponse.json({ success: true });
}
