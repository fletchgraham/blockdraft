"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";

export const deleteBlock = async (blockId) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");

  try {
    await blocksCollection.deleteOne({
      _id: ObjectId.createFromHexString(blockId),
      userId: ObjectId.createFromHexString(user.id),
    });
  } catch (error) {
    console.error("Error deleting block", error);
  }

  // see if the block is actually gone
  const block = await blocksCollection.findOne({
    _id: ObjectId.createFromHexString(blockId),
    userId: ObjectId.createFromHexString(user.id),
  });

  return { success: !block };
};
