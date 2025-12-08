"use server";
import { redirect } from "next/navigation";

import * as cheerio from "cheerio";
import { ObjectId } from "mongodb";
import { auth } from "@/auth"; // Import the Auth.js function
import { getCollection, cleanMongoDocument } from "@/lib/db";
import { Block } from "@/types/block";

// Get inbox blocks for the authenticated user
export const getInboxBlocks = async (limit: number = 100) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      userId: ObjectId.createFromHexString(user.userId),
      $or: [{ draftId: { $exists: false } }, { draftId: null }],
    })
    .sort({ contentDate: -1 }) // Sort by most recent contentDate
    .limit(limit)
    .toArray();

  return blocks.map(cleanMongoDocument);
};

// Get blocks for a specific draft
export const getBlocksForDraft = async (draftId: string) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  // Validate the draftId
  if (!ObjectId.isValid(draftId)) {
    throw new Error("Invalid draft ID");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      draftId: ObjectId.createFromHexString(draftId), // Match the draftId
      userId: ObjectId.createFromHexString(user.userId), // Ensure the block belongs to the authenticated user
    })
    .sort({ order: 1, _id: 1 }) // Sort by `order` and `_id` as fallback
    .toArray();

  // Clean the blocks before returning
  return blocks.map(cleanMongoDocument);
};

const extractContentDate = ($) => {
  const dateSelectors = [
    "meta[property='article:published_time']", // Open Graph property
    "meta[name='article:published_time']", // Some alternative formats
    "meta[name='publish-date']",
    "meta[name='pubdate']",
    "time[datetime]",
  ];

  for (const selector of dateSelectors) {
    const dateValue =
      $(selector).attr("content") || $(selector).attr("datetime");
    if (dateValue) {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  return null;
};

export const createBlockFromUrl = async (url: string): Promise<Block> => {
  const block = {
    userId: null,
    draftId: null,
    url: url,
    title: "",
    thumbnailUrl: "",
    contentDate: new Date(),
  };

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);

  // Get the image URL from meta tags
  block.thumbnailUrl =
    $("meta[property='og:image']").attr("content") ||
    $("meta[name='twitter:image']").attr("content") ||
    "";

  block.title = $("title").text() || "Untitled";

  // Attempt to extract content date from the page
  const extractedDate = extractContentDate($);
  if (extractedDate) {
    block.contentDate = extractedDate;
  }

  return block;
};

export const importBlock = async (
  userId: string,
  url: string
): Promise<{ success: boolean; id?: string }> => {
  console.log("Importing block from URL:", url);

  if (!userId || !url) {
    throw new Error("Missing userId or url");
  }

  const block = await createBlockFromUrl(url);
  const mongoBlock = {
    ...block,
    userId: ObjectId.createFromHexString(userId),
  };

  const blocksCollection = await getCollection("blocks");
  const result = await blocksCollection.insertOne(mongoBlock);

  return { success: true, id: result.insertedId.toString() };
};
