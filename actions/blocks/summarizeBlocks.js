"use server";

import { getCollection } from "@/lib/db";
import { retryWithBackoff } from "@/lib/retry";
import { ObjectId } from "mongodb";

// Utility to truncate page text
const truncateText = (text, maxLength = 1000) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export async function summarizeBlocks(draftId) {
  if (!draftId) {
    throw new Error("Draft ID is required");
  }

  try {
    const blocksCollection = await getCollection("blocks");
    const blocks = await blocksCollection
      .find({ draftId: ObjectId.createFromHexString(draftId) })
      .toArray();

    if (!blocks || blocks.length === 0) {
      console.warn(`No blocks found for draft ID: ${draftId}`);
      return;
    }

    // Process each block in parallel
    await Promise.allSettled(
      blocks.map(async (block) => {
        // Skip "custom" blocks or blocks with existing summaries
        if (block.type === "custom" || block.summary) {
          return;
        }

        let pageText = "";
        try {
          // Fetch page content from block URL
          const pageResponse = await fetch(block.url);
          if (!pageResponse.ok) throw new Error("Failed to fetch page content");
          pageText = truncateText(await pageResponse.text());
        } catch (error) {
          console.error(`Error fetching URL ${block.url}:`, error);
          pageText = "The content could not be fetched."; // Fallback content
        }

        // Generate summary with retry logic
        const generateSummary = async () => {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: "You are a summarization assistant.",
                  },
                  { role: "user", content: `Summarize this: ${pageText}` },
                ],
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch summary: ${response.statusText}`);
          }

          const data = await response.json();
          return data.choices[0].message.content.trim();
        };

        const summary = await retryWithBackoff(generateSummary);

        // Update the block in the database
        await blocksCollection.updateOne(
          { _id: block._id },
          { $set: { summary } }
        );
      })
    );
  } catch (error) {
    console.error("Error summarizing blocks:", error);
  }
}
