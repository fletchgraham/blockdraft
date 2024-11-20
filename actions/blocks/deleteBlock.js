"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { getUserFromCookies } from "@/lib/getUser";
import { getCollection } from "@/lib/db";

export const deleteBlock = async (blockId) => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");

  try {
    await blocksCollection.deleteOne({
      _id: ObjectId.createFromHexString(blockId),
      userId: ObjectId.createFromHexString(user.userId),
    });
  } catch (error) {
    console.error("Error deleting block", error);
  }

  // see if the block is actually gone
  const block = await blocksCollection.findOne({
    _id: ObjectId.createFromHexString(blockId),
    userId: ObjectId.createFromHexString(user.userId),
  });

  return { success: !block };
};
