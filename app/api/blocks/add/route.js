import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db"; // MongoDB connection helper
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Request body must be a non-empty array of blocks." },
        { status: 400 }
      );
    }

    // Validate each block
    for (const block of body) {
      if (
        !block.draftId ||
        typeof block.draftId !== "string" ||
        !block.type ||
        typeof block.type !== "string" ||
        !block.content ||
        typeof block.content !== "string"
      ) {
        return NextResponse.json(
          {
            message:
              "Each block must include draftId, type, and content as strings.",
          },
          { status: 400 }
        );
      }
    }

    // turn draftId into ObjectId
    body.forEach((block) => {
      block.draftId = ObjectId.createFromHexString(block.draftId);
    });

    // Get the MongoDB collection
    const blocksCollection = await getCollection("blocks");

    // Insert blocks into the database
    const result = await blocksCollection.insertMany(body);

    // Retrieve the inserted blocks
    const insertedBlocks = await blocksCollection
      .find({ _id: { $in: Object.values(result.insertedIds) } })
      .toArray();

    // Return the newly added blocks
    return NextResponse.json(insertedBlocks, { status: 201 });
  } catch (error) {
    console.error("Error in /api/blocks/add:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
