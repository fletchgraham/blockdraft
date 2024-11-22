"use server";

import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

import { fetchPageText } from "@/lib/fetchPageText";
import { summarizeText } from "@/lib/summarizeText";

export async function summarizeBlocks(draftId) {
  try {
    const blocksCollection = await getCollection("blocks");
    const blocks = await blocksCollection
      .find({ draftId: ObjectId.createFromHexString(draftId) })
      .toArray();

    await Promise.all(
      blocks.map(async (block) => {
        if (block.type === "custom" || block.summary) {
          return;
        }

        const pageText = await fetchPageText(block.url);

        let summary;
        if (!pageText) {
          summary = "Could not get page text";
        } else {
          summary = await summarizeText(pageText);
        }
        await blocksCollection.updateOne(
          { _id: block._id },
          { $set: { summary } }
        );
      })
    );
  } catch (error) {
    console.error(`Error summarizing blocks: ${error.message}`);
  }
}
