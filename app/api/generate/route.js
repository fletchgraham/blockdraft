import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { retryWithBackoff } from "@/lib/retry";
import { ObjectId } from "mongodb";

// Utility to truncate page text
const truncateText = (text, maxLength = 1000) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export async function POST(request) {
  try {
    const { draftId } = await request.json();
    if (!draftId) {
      return NextResponse.json(
        { error: "Draft ID is required" },
        { status: 400 }
      );
    }

    const blocksCollection = await getCollection("blocks");
    const blocks = await blocksCollection
      .find({ draftId: ObjectId.createFromHexString(draftId) })
      .toArray();

    if (!blocks || blocks.length === 0) {
      return NextResponse.json(
        { error: "No blocks found for this draft" },
        { status: 404 }
      );
    }

    // Process each block in parallel
    const summaries = await Promise.allSettled(
      blocks.map(async (block) => {
        // Skip "custom" blocks or blocks with existing summaries
        if (block.type === "custom" || block.summary) {
          return block;
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

        return { ...block, summary };
      })
    );

    // Filter successful summaries
    const resolvedSummaries = summaries
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return NextResponse.json({ success: true, summaries: resolvedSummaries });
  } catch (error) {
    console.error("Error generating summaries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
