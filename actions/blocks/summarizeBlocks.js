"use server";

import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

import { fetchPageText } from "@/lib/fetchPageText";
import { summarizeText } from "@/lib/summarizeText";

// Configuration for the block limit
const MONTHLY_BLOCK_LIMIT = 1000;
// Hardcoded start date for tracking usage
const BILLING_START_DATE = new Date("2024-12-09");

export async function summarizeBlocks(userId, draftId) {
  try {
    const usageCollection = await getCollection("userUsage");
    const blocksCollection = await getCollection("blocks");

    // Fetch or initialize the user's usage since the hardcoded start date
    let userUsage = await usageCollection.findOne({
      userId: ObjectId.createFromHexString(userId),
      billingCycleStart: BILLING_START_DATE,
    });

    if (!userUsage) {
      userUsage = {
        userId: ObjectId.createFromHexString(userId),
        billingCycleStart: BILLING_START_DATE,
        blocksSummarized: 0,
      };
      await usageCollection.insertOne(userUsage);
    }

    // Fetch the blocks to summarize
    const blocks = await blocksCollection
      .find({ draftId: ObjectId.createFromHexString(draftId) })
      .toArray();

    // Process each block
    let blocksSummarized = 0;
    await Promise.all(
      blocks.map(async (block) => {
        if (block.type === "custom" || block.summary) {
          return;
        }

        // Determine if the limit is reached
        const currentUsage = userUsage.blocksSummarized + blocksSummarized;
        if (currentUsage >= MONTHLY_BLOCK_LIMIT) {
          // Use placeholder text for blocks when the limit is reached
          await blocksCollection.updateOne(
            { _id: block._id },
            {
              $set: {
                summary:
                  "You've reached your usage limit! Please upgrade to summarize more blocks.",
              },
            }
          );
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

        blocksSummarized++;
      })
    );

    // Update the user's usage in the database
    await usageCollection.updateOne(
      {
        userId: ObjectId.createFromHexString(userId),
        billingCycleStart: BILLING_START_DATE,
      },
      { $inc: { blocksSummarized } }
    );

    return {
      success: true,
      blocksSummarized,
      remaining: Math.max(
        0,
        MONTHLY_BLOCK_LIMIT - userUsage.blocksSummarized - blocksSummarized
      ),
    };
  } catch (error) {
    console.error(`Error summarizing blocks: ${error.message}`);
    throw new Error(error.message);
  }
}
